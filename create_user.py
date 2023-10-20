from app import app, db, User, generate_password_hash, generate_salt

USERNAME = "daniel"
PASSWORD = "adamek"

with app.app_context():
    db.create_all()
    salt = generate_salt()
    password_hash = generate_password_hash(PASSWORD, salt)
    sample_user = User(username=USERNAME, password=password_hash, salt=salt)
    db.session.add(sample_user)
    db.session.commit()

    inserted_user = User.query.filter_by(username=USERNAME).first()
    if inserted_user:
        print(f"Sample user {inserted_user.username} has been inserted into the database.")
    else:
        print("Failed to insert sample user.")