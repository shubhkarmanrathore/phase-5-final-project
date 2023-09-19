from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String(25), unique = True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique = True, nullable=False)
    address = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String(10), unique = True, nullable=False)
    payment_card = db.Column(db.String(16), nullable=False)

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=False)
    rating = db.Column(db.String, nullable=False)

class Cart(db.Model, SerializerMixin):
    __tablename__ = 'cart'
    
    id = db.Column(db.Integer, primary_key = True)
    product_id = db.Column(db.String, nullable=False)
    product_name = db.Column(db.String, nullable=False)
    product_quantity = db.Column(db.Integer, nullable=False)
    product_price = db.Column(db.Float, nullable=False)
    product_image = db.Column(db.String, nullable=False)
    user_id = db.Column(db.String, nullable=False)

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String, nullable=False)
    product_price = db.Column(db.Integer, nullable=False)
    product_quantity = db.Column(db.Integer, nullable=False)
    order_date = db.Column(db.String, nullable=False)
    order_status = db.Column(db.String, nullable=False)
    user_id = db.Column(db.String, db.ForeinKey('users.id'))

        

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key = True)
    product_id = db.Column(db.String, nullable=False)
    user_id = db.Column(db.String, nullable=False)
    body = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.String, nullable=False)

    product = db.relationship("Product", back_populates = "reviews")
    user = db.relationship("User", back_populates = "reviews")