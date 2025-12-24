from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

def create_admin():
    db = SessionLocal()
    email = "admin@example.com"
    password = "admin123"
    
    user = db.query(User).filter(User.email == email).first()
    if user:
        print(f"User {email} already exists. Updating to admin...")
        user.is_admin = True
        user.is_active = 1
        # Optional: Reset password to be sure
        user.hashed_password = get_password_hash(password)
    else:
        print(f"Creating new admin user {email}...")
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            is_admin=True,
            is_active=1
        )
        db.add(user)
    
    db.commit()
    print(f"Admin user ready: {email} / {password}")
    db.close()

if __name__ == "__main__":
    create_admin()
