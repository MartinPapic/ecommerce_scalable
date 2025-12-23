from sqlalchemy import text
from app.database import engine, SessionLocal
from app.models import User

def upgrade_db():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0"))
            print("Added is_admin column.")
        except Exception as e:
            print(f"Column might already exist: {e}")

def promote_admin():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "admin@example.com").first()
    if user:
        user.is_admin = True
        db.commit()
        print(f"User {user.email} promoted to Admin.")
    else:
        print("Admin user not found.")
    db.close()

if __name__ == "__main__":
    upgrade_db()
    promote_admin()
