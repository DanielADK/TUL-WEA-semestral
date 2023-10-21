from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from flask_cors import CORS, cross_origin
import datetime
import hashlib
import jwt
import os

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_EXPIRATION_DELTA"] = datetime.timedelta(days=1)
app.config["SECRET_KEY"] = "YOUR_KEY_HERE"
db = SQLAlchemy(app)
auth = HTTPBasicAuth()


def generate_password_hash(password, salt):
    salted_password = f"{password}{salt}"
    return hashlib.sha256(salted_password.encode()).hexdigest()


def check_password_hash(stored_password_hash, provided_password, salt):
    computed_hash = generate_password_hash(provided_password, salt)
    return stored_password_hash == computed_hash


def generate_salt(length: int = 32):
    return os.urandom(length).hex()


def generate_token(user_id: int):
    expiration_time = datetime.datetime.utcnow() + app.config["JWT_EXPIRATION_DELTA"]
    payload = {
        "exp": expiration_time,
        "iat": datetime.datetime.utcnow(),
        "user_id": user_id,
    }

    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    salt = db.Column(db.String(255))


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    description = db.Column(db.String(255))
    completed = db.Column(db.Boolean)

    user = db.relationship("User", backref=db.backref("tasks", lazy=True))


@app.route("/login", methods=["POST"])
@cross_origin(origins="http://localhost:5173")
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password, user.salt):
        return jsonify({"success": True, "token": generate_token(user.id)}), 200
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route("/tasks", methods=["GET"])
@auth.login_required
def get_tasks():
    user: any = auth.current_user()
    tasks: list = Task.query.filter_by(user_id=user.id).all()
    return jsonify([
        {"id": task.id,
         "description": task.description,
         "completed": task.completed
         } for task in tasks])


@app.route("/tasks", methods=["POST"])
@auth.login_required
def create_task():
    user: any = auth.current_user()
    data: any = request.get_json()
    new_task = Task(description=data["description"], completed=False, user_id=user.id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({
        "id": new_task.id,
        "description": new_task.description,
        "completed": new_task.completed
    })


@app.route("/tasks/<int:task_id>", methods=["PUT"])
@auth.login_required
def update_task(task_id):
    user = auth.current_user()
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
@auth.login_required
def delete_task(task_id):
    user = auth.current_user()
    task = Task.query.filter_by(id=task_id, user_id=user.id).first()
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"result": "Task deleted"})


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True, port=5000)
