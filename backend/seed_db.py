from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

def seed_db():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(models.Product).first():
        print("La base de datos ya tiene datos.")
        return

    print("Sembrando datos iniciales...")
    
    products = [
        models.Product(
            name="Botella de Agua Ecológica",
            description="Botella de acero inoxidable de 500ml, sostenible y duradera.",
            price=25.99,
            image_url="/file.svg",
            category="Accesorios"
        ),
        models.Product(
            name="Camiseta de Algodón Orgánico",
            description="Camiseta básica 100% algodón orgánico.",
            price=19.99,
            image_url="/globe.svg",
            category="Ropa"
        )
    ]
    
    db.add_all(products)
    db.commit()
    print("Datos sembrados exitosamente!")
    db.close()

if __name__ == "__main__":
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    seed_db()
