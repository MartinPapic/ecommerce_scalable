from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
import shutil
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from . import models, schemas
from .database import SessionLocal, engine

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"{UPLOAD_DIR}/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/static/{unique_filename}"}

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Ecommerce API is running"}

@app.get("/products", response_model=schemas.PaginatedProductResponse)
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    q: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    
    if q:
        search_filter = f"%{q}%"
        query = query.filter(
            (models.Product.name.like(search_filter)) | 
            (models.Product.description.like(search_filter))
        )
    
    if category:
        query = query.filter(models.Product.category == category)
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    return {"items": products, "total": total}

@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/categories", response_model=List[str])
def read_categories(db: Session = Depends(get_db)):
    # Efficiently get distinct categories
    categories = db.query(models.Product.category).distinct().all()
    # categories is a list of tuples [('Ropa',), ('Hogar',)], flatten it
    return [c[0] for c in categories if c[0]]

# Security & Auth
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from . import auth

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except auth.JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.post("/orders", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Validate items and calculate total server-side
    total_amount = 0
    order_items_data = []

    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        total_amount += product.price * item.quantity
        order_items_data.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": product.price
        })

    # 2. Create Order
    db_order = models.Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="completed" # MVP: Auto-complete for now
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # 3. Create OrderItems
    for item_data in order_items_data:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            price=item_data["price"]
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders", response_model=List[schemas.OrderResponse])
def read_orders(current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).order_by(models.Order.created_at.desc()).all()
    return orders

# Admin Endpoints
def get_current_admin(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), admin: schemas.User = Depends(get_current_admin)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db), admin: schemas.User = Depends(get_current_admin)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}

@app.get("/admin/users", response_model=List[schemas.AdminUserResponse])
def read_admin_users(db: Session = Depends(get_db), admin: schemas.User = Depends(get_current_admin)):
    users = db.query(models.User).all()
    response = []
    for user in users:
        # Calculate metrics from orders
        orders = db.query(models.Order).filter(models.Order.user_id == user.id).all()
        total_spent = sum(order.total_amount for order in orders)
        orders_count = len(orders)
        
        # Simple Logic for Tags and LTV
        tags = []
        if total_spent > 100000:
            tags.append("VIP")
        if orders_count > 5:
            tags.append("Frecuente")
        if not orders:
            tags.append("Nuevo")
            
        ltv_score = min(int((total_spent / 500000) * 100), 100) # Simple normalization
        
        response.append({
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active == 1,
            "is_admin": user.is_admin,
            "created_at": user.created_at,
            "last_login": user.last_login,
            "phone": user.phone,
            "address": user.address,
            "total_spent": total_spent,
            "orders_count": orders_count,
            "ltv_score": ltv_score,
            "tags": tags
        })
    return response

@app.get("/admin/users/{user_id}", response_model=schemas.AdminUserResponse)
def read_admin_user_detail(user_id: int, db: Session = Depends(get_db), admin: schemas.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate metrics (Same logic - ideally move to service/util)
    orders = db.query(models.Order).filter(models.Order.user_id == user.id).all()
    total_spent = sum(order.total_amount for order in orders)
    orders_count = len(orders)
    
    tags = []
    if total_spent > 100000:
        tags.append("VIP")
    if orders_count > 5:
        tags.append("Frecuente")
    if not orders:
        tags.append("Nuevo")
        
    ltv_score = min(int((total_spent / 500000) * 100), 100)

    return {
        "id": user.id,
        "email": user.email,
        "is_active": user.is_active == 1,
        "is_admin": user.is_admin,
        "created_at": user.created_at,
        "last_login": user.last_login,
        "phone": user.phone,
        "address": user.address,
        "total_spent": total_spent,
        "orders_count": orders_count,
        "ltv_score": ltv_score,
        "tags": tags
    }

# Inventory Management
@app.get("/inventory/dashboard")
def get_inventory_dashboard(db: Session = Depends(get_db), admin: schemas.User = Depends(get_current_admin)):
    products = db.query(models.Product).all()
    
    total_valuation = sum(p.stock_quantity * p.cost_price for p in products)
    low_stock_count = sum(1 for p in products if p.stock_quantity <= p.min_stock and p.stock_quantity > 0)
    out_of_stock_count = sum(1 for p in products if p.stock_quantity == 0)
    
    return {
        "total_valuation": total_valuation,
        "low_stock_count": low_stock_count,
        "out_of_stock_count": out_of_stock_count,
        "total_sku": len(products)
    }

class StockMovementCreate(BaseModel):
    product_id: int
    quantity: int
    movement_type: str # IN, OUT, ADJUSTMENT
    reason: str | None = None

@app.post("/inventory/movements", response_model=schemas.StockMovementResponse)
def create_stock_movement(movement: StockMovementCreate, db: Session = Depends(get_db), admin: schemas.User = Depends(get_current_admin)):
    product = db.query(models.Product).filter(models.Product.id == movement.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update Product Stock
    if movement.movement_type == "IN":
        product.stock_quantity += movement.quantity
    elif movement.movement_type == "OUT":
        product.stock_quantity -= movement.quantity
        if product.stock_quantity < 0:
             # Option: Allow negative stock or not? For now, allow it but maybe warn.
             pass
    elif movement.movement_type == "ADJUSTMENT":
        # Adjustment sets the absolute stock? Or is it a delta? 
        # Usually adjustment is a delta too, but let's assume the 'quantity' passed is the DELTA.
        # If user wants to set exact stock, frontend calculates delta.
        product.stock_quantity += movement.quantity
    
    db_movement = models.StockMovement(
        product_id=movement.product_id,
        quantity=movement.quantity,
        movement_type=movement.movement_type,
        reason=movement.reason
    )
    
    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement

@app.get("/inventory/movements", response_model=List[schemas.StockMovementResponse])
def get_stock_movements(product_id: int | None = None, db: Session = Depends(get_db), admin: schemas.User = Depends(get_current_admin)):
    query = db.query(models.StockMovement)
    if product_id:
        query = query.filter(models.StockMovement.product_id == product_id)
    return query.order_by(models.StockMovement.created_at.desc()).limit(100).all()

