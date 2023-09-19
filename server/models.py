from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String)
    password_hash = db.Column(db.String)
    email = db.Column(db.String)
    address = db.Column(db.String)
    phone_number = db.Column(db.String)
    payment_card = db.Column(db.String)

class Product(db.Model, SerializerMixin):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    price = db.Column(db.Integer)
    description = db.Column(db.String)
    category = db.Column(db.String)
    image = db.Column(db.String)
    rating = db.Column(db.String)

class Cart(db.Model, SerializerMixin):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key = True)
    pass

class Order(db.Model, SerializerMixin):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key = True)
    pass