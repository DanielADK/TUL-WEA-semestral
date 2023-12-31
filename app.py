""" Flask API for the task manager app """
from functools import wraps
import datetime
import hashlib
import os
import jwt
from flask import Flask, request, jsonify, Response, make_response, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin

# Basic Flask setup
app = Flask(__name__)
CORS(app, resources={
    r"*": {
       "origins": ["https://todo.danieladamek.eu", "http://localhost:5173"],
       "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
       "allow_headers": ["Authorization", "Content-Type"]
    }
})
# App configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_EXPIRATION_DELTA"] = datetime.timedelta(hours=8)
app.config["SECRET_KEY"] = "YOUR_KEY_HERE"
db = SQLAlchemy(app)
auth = HTTPBasicAuth()


class User(db.Model):
    """
    User model
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    salt = db.Column(db.String(255))


class Task(db.Model):
    """
    Task model
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    description = db.Column(db.String(255))
    completed = db.Column(db.Boolean)

    user = db.relationship("User", backref=db.backref("tasks", lazy=True))

    def to_export_dict(self) -> dict:
        return {
            "id": self.id,
            "description": self.description,
            "completed": self.completed,
        }


def generate_password_hash(password, salt):
    """
    Generates a password hash
    :param password:
    :param salt:
    :return:
    """
    salted_password = f"{password}{salt}"
    return hashlib.sha256(salted_password.encode()).hexdigest()


def check_password_hash(stored_password_hash, provided_password, salt):
    """
    Checks if the provided password matches the stored password
    :param stored_password_hash:
    :param provided_password:
    :param salt:
    :return:
    """
    computed_hash = generate_password_hash(provided_password, salt)
    return stored_password_hash == computed_hash


def generate_salt(length: int = 32):
    """
    Generates a random salt
    :param length:
    :return:
    """
    return os.urandom(length).hex()


def generate_token(user_id: int):
    """
    Generates a JWT token for the user
    :param user_id:
    :return:
    """
    expiration_time = datetime.datetime.utcnow() + app.config["JWT_EXPIRATION_DELTA"]
    payload = {
        "exp": expiration_time,
        "iat": datetime.datetime.utcnow(),
        "user_id": user_id,
    }

    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def verify_token(token):
    """
    Verifies the token and returns the user if the token is valid
    :param token:
    :return:
    """
    try:
        data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return User.query.filter_by(id=data["user_id"]).first()
    except jwt.ExpiredSignatureError:
        return None


def token_required(f):
    """
    Decorator to check if the request contains a valid token
    :param f:
    :return:
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        """
        Decorated function
        :param args:
        :param kwargs:
        :return:
        """
        token = None

        if "Authorization" in request.headers:
            token = request.headers['Authorization'].replace("Bearer ", "")

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data["user_id"]).first()
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token is invalid"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


@app.route("/login", methods=["POST"])
def login():
    """
    Login endpoint
    :return:
    """
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password, user.salt):
        return jsonify({
            "success": True,
            "token": generate_token(user.id),
            "username": user.username,
            "userId": user.id
        }), 200
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route("/tasks", methods=["GET"])
@token_required
def get_tasks(user):
    """
    Get all tasks
    :param user:
    :return:
    """
    tasks: list = Task.query.filter_by(user_id=user.id).all()
    return jsonify([
        {"id": task.id,
         "description": task.description,
         "completed": task.completed,
         } for task in tasks])


@app.route("/tasks", methods=["POST"])
@token_required
def create_task(user):
    """
    Create a new task
    :param user:
    :return:
    """
    data = request.get_json()
    new_task = Task(description=data["description"], completed=False, user_id=user.id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({
        "id": new_task.id,
        "description": new_task.description,
        "completed": new_task.completed
    })


@app.route("/tasks/<int:task_id>", methods=["PUT"])
@token_required
def update_task(user, task_id: int):
    """
    Update a task
    :param user:
    :param task_id:
    :return:
    """
    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    data = request.get_json()
    task.description = data.get("description", task.description)
    task.completed = data.get("completed", task.completed)
    db.session.commit()
    return jsonify({
        "id": task.id,
        "description": task.description,
        "completed": task.completed
    })


@app.route("/tasks/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(user, task_id):
    """
    Delete a task
    :param user:
    :param task_id:
    :return:
    """
    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"result": "Task deleted"})


@app.route('/export/<string:export_format>', methods=['GET'])
def export(export_format: str):
    """
    Export tasks to JSON or HTML
    :param export_format:
    :return:
    """
    token = request.args.get('token')

    # Verify token
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded['user_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"error": "Invalid token"}), 401

    # Load tasks from DB
    tasks: list = Task.query.filter_by(user_id=user_id).all()

    if export_format == 'json':
        # Generate JSON
        response = make_response(jsonify([task.to_export_dict() for task in tasks]))
        response.headers['Content-Type'] = 'application/json'
        return response
    elif export_format == 'html':
        # Generate HTML
        return render_template('tasks.html', tasks=tasks)
    else:
        # Unsupported format
        return jsonify({"error": "Unsupported format"}), 400


if __name__ == "__main__":
    # db.create_all()
    app.run(debug=False, host="0.0.0.0", port=5000)
