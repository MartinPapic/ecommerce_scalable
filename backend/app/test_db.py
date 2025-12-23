from database import engine
from sqlalchemy import text

def test_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Conexión a MySQL exitosa!")
    except Exception as e:
        print(f"❌ Error al conectar a MySQL: {e}")

if __name__ == "__main__":
    test_connection()
