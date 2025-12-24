from app.database import SessionLocal
from app.models import User

def check_users():
    db = SessionLocal()
    users = db.query(User).all()
    print(f"Found {len(users)} users:")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Is Admin: {user.is_admin}")
    db.close()

if __name__ == "__main__":
    check_users()
