from app import models, database
from sqlalchemy.orm import Session

db = database.SessionLocal()

print("--- USERS ---")
users = db.query(models.User).all()
for u in users:
    print(f"ID: {u.id}, Email: {u.email}, Admin: {u.is_admin}")

print("\n--- PRODUCTS ---")
products = db.query(models.Product).all()
print(f"Total Products: {len(products)}")
for p in products[:5]:
    print(f"ID: {p.id}, Name: {p.name}, Price: {p.price}, Stock: {p.stock_quantity}")

print("\n--- ORDERS ---")
orders = db.query(models.Order).all()
print(f"Total Orders: {len(orders)}")
