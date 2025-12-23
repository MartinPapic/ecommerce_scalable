from app import models
from app.database import SessionLocal, engine
import random

def seed_more():
    db = SessionLocal()
    print("Seeding 20 more products...")
    
    categories = ["Ropa", "Hogar", "Accesorios", "Electronica"]
    
    products = []
    for i in range(20):
        products.append(models.Product(
            name=f"Producto Test {i+1}",
            description=f"Descripcion para el producto de prueba {i+1}",
            price=random.uniform(10.0, 100.0),
            image_url="/file.svg", # Placeholder
            category=random.choice(categories)
        ))
        
    db.add_all(products)
    db.commit()
    print("Sembrado completo.")
    db.close()

if __name__ == "__main__":
    seed_more()
