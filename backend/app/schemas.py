from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    image_url: str
    category: str
    # Inventory
    sku: str | None = None
    stock_quantity: int = 0
    min_stock: int = 5
    cost_price: float = 0.0
    supplier: str | None = None

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool = False

    class Config:
        from_attributes = True # Changed from orm_mode to from_attributes for Pydantic v2 compatibility

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: list[OrderItemCreate]

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float
    product: ProductBase # Include basic product details
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class StockMovementResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    movement_type: str
    reason: str | None = None
    created_at: datetime
    product: ProductBase

    class Config:
        from_attributes = True

class PaginatedProductResponse(BaseModel):
    items: list[Product]
    total: int

class AdminUserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime | None = None
    last_login: datetime | None = None
    phone: str | None = None
    address: str | None = None
    
    # Computed metrics
    total_spent: float = 0
    orders_count: int = 0
    ltv_score: int = 0
    tags: list[str] = []

    class Config:
        from_attributes = True

class DailySales(BaseModel):
    date: str
    revenue: float
    orders: int

class CategorySales(BaseModel):
    name: str
    value: float

class DashboardStatsResponse(BaseModel):
    totalRevenue: float
    totalOrders: int
    conversionRate: float
    avgTicket: float
    salesTrend: list[DailySales]
    categoryDistribution: list[CategorySales]
