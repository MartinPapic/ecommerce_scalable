from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(Text)
    price = Column(Float)
    image_url = Column(String(255))
    category = Column(String(100), index=True)
