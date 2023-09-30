from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
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

    reviews = db.relationship("Review", back_populates="user")
    orders = db.relationship("Order", back_populates="user")
    cart = db.relationship("Cart", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"
    
    # @hybrid_property
    # def password_hash(self):
    #     return self.password_hash
    
    # @password_hash.setter
    # def password_hash(self, password):
    #     self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # def password_check(self, password):
    #     return bcrypt.check_password_hash(self.password_hash, password)

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=False)

    reviews = db.relationship("Review", back_populates="product")
    cart = db.relationship("Cart", back_populates="product")

    def __repr__(self):
        return f"<Product {self.title}>"

class Cart(db.Model, SerializerMixin):
    __tablename__ = 'cart'
    
    id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String, nullable=False)
    product_quantity = db.Column(db.Integer, nullable=False)
    product_price = db.Column(db.Float, nullable=False)
    product_image = db.Column(db.String, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    product = db.relationship("Product", back_populates="cart")
    user = db.relationship("User", back_populates="cart")

    def __repr__(self):
        return f"<Cart Item - {self.product_name}>"

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String, nullable=False)
    product_price = db.Column(db.Integer, nullable=False)
    product_quantity = db.Column(db.Integer, nullable=False)
    order_date = db.Column(db.String, nullable=False)
    order_status = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="orders")

def __repr__(self):
        return f"<Order ID: {self.id}>"

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    product = db.relationship("Product", back_populates = "reviews")
    user = db.relationship("User", back_populates = "reviews")

    def __repr__(self):
        return f"<Review by User ID: {self.user_id} for Product ID: {self.product_id}>"