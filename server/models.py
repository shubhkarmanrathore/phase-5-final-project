from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_only = (
        "reviews.body",
        "reviews.rating",
        "cart.id",
        "name",
        "address",
        "payment_card",
        "id",
    )
    
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String(25), unique = True, nullable=False)
    password= db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique = True, nullable=False)
    address = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String(10), unique = True, nullable=False)
    payment_card = db.Column(db.String(16), nullable=False)

    reviews = db.relationship("Review", back_populates="user")
    orders = db.relationship("Order", back_populates="user")
    cart = db.relationship("Cart", back_populates="user")

    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        if len(phone_number) != 10:
            raise ValueError("Phone number must be exactly 10 digits long")
        return phone_number

    serialize_rules = (
    "-reviews.user",
    "-orders.user",
    "-cart.user",
)

    def __repr__(self):
        return f"<User {self.username}>"
    
    @hybrid_property
    def password_hash(self):
        return self.password
    
    @password_hash.setter
    def password_hash(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def password_check(self, password):
        return bcrypt.check_password_hash(self.password, password)

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=False)

    orders = db.relationship("Order", back_populates="product")
    reviews = db.relationship("Review", back_populates="product")
    cart = db.relationship("Cart", back_populates="product")

    serialize_rules = (
    "-reviews.product",
    "-cart.product",
    "-orders.product"
)

    def __repr__(self):
        return f"<Product {self.title}>"

class Cart(db.Model, SerializerMixin):
    __tablename__ = 'cart'
    
    id = db.Column(db.Integer, primary_key = True)
    product_quantity = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    product = db.relationship("Product", back_populates="cart")
    user = db.relationship("User", back_populates="cart")

    serialize_rules = (
        "-user.cart",
        "-product.cart",

    )

    def __repr__(self):
        return f"<Cart Item - {self.product_name}>"

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    product_quantity = db.Column(db.Integer, nullable=False)
    order_date = db.Column(db.String, nullable=False)
    order_status = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    product = db.relationship("Product", back_populates="orders")
    user = db.relationship("User", back_populates="orders")

    serialize_rules = (
    "-user.orders",
    "-product.orders"
)

    def __repr__(self):
        return f"<Order ID: {self.id}>"

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable=False)
    body = db.Column(db.String, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    product = db.relationship("Product", back_populates = "reviews")
    user = db.relationship("User", back_populates = "reviews")

    serialize_rules = (
    "-product.reviews",
    "-user.reviews",
    "user.username",
    "user.id",
)

    def __repr__(self):
        return f"<Review by User ID: {self.user_id} for Product ID: {self.product_id}>"