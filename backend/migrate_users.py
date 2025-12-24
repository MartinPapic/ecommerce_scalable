from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        print("Migrating users table...")
        
        # Add columns if they don't exist (MySQL syntax)
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"))
            print("Added created_at")
        except Exception as e:
            print(f"Skipped created_at: {e}")

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN last_login DATETIME NULL"))
            print("Added last_login")
        except Exception as e:
             print(f"Skipped last_login: {e}")
             
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL"))
            print("Added phone")
        except Exception as e:
             print(f"Skipped phone: {e}")

        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN address VARCHAR(255) NULL"))
            print("Added address")
        except Exception as e:
             print(f"Skipped address: {e}")
             
        conn.commit()
        print("Migration complete.")

if __name__ == "__main__":
    migrate()
