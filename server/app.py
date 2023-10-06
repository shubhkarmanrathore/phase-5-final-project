from flask import Flask, make_response, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, reqparse
from models import Product, User, Cart, Review
from config import app, db, api


class Products(Resource):
    def get(self):
        all_products = Product.query.all()
        product_list = []

        for product in all_products:
            product_dict = product.to_dict()
            product_list.append(product_dict)

        response = make_response(jsonify(product_list), 200)
        return response
    
    
api.add_resource(Products, '/products')


class Product_By_Id(Resource):
    
    def get(self, id):
        product_id = Product.query.get(id)
        product_dict = product_id.to_dict()
        return make_response(jsonify(product_dict), 200)
    
    def delete(self, id):
        product_id = Product.query.get(id)
        if product_id:
            try:
                db.session.delete(product_id)
                db.session.commit()
                return make_response({'message':'The product has been deleted.'}, 200)
            
            except Exception as e:
                db.session.rollback()
                return make_response({'message':'Error occured', 'error':str(e)}, 500)
            
        else:
            return make_response({'message': 'Product cannot be found.'})

api.add_resource(Product_By_Id, "/product/<int:id>")


class Users(Resource):

    def get(self):
        users = User.query.all()
        user_list = []

        for user in users:
            user_dict = user.to_dict()
            user_list.append(user_dict)

        response = make_response(jsonify(user_list), 200)
        return response
    

    def post(self):
        data = request.get_json()
        try:
            name = data.get("name")
            email = data.get("email")
            username = data.get("username")
            password_hash = data.get("password")
            address = data.get("address")
            phone_number = data.get("phone_number")
            payment_card = data.get("payment_card")

            user = User(
                name=name,
                email=email,
                username=username,
                address=address,
                phone_number=phone_number,
                payment_card=payment_card,
            )

            user.password_hash = password_hash

            db.session.add(user)
            db.session.commit()

            return user.to_dict(), 201

        except Exception as e:
            error_message = "An error occurred while processing your request"
            return {"error": error_message}, 500

api.add_resource(Users, '/users')

class User_By_Id(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return make_response({'message': 'User not found'}, 404)
        user_data = user.to_dict()
        return make_response(jsonify(user_data), 200)

    def delete(self, id):
        user = User.query.get(id)
        if not user:
            return make_response({'message': 'User not found'}, 404)

        try:
            db.session.delete(user)
            db.session.commit()
            return make_response({'message': 'User deleted successfully'}, 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'message': 'Error occurred', 'error': str(e)}, 500)

api.add_resource(User_By_Id, '/users/<int:id>')

def check_login(func):
    def wrapper(*args, **kwargs):
        if not session.get("user_id"):
            return make_response(jsonify({"message": "Not logged in"}), 401)
        return func(*args, **kwargs)
    return wrapper

class Cart_Resource(Resource):
    @check_login
    def get(self):
        try:
            user_id = session.get("user_id")
            cart_products = Cart.query.filter_by(user_id=user_id).all()
            cart_products_list = [product.to_dict() for product in cart_products]

            return make_response(jsonify({"cart_items": cart_products_list}), 200)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(Cart_Resource, "/cart/user")

class Cart_Product(Resource):
    @check_login
    def post(self, product_id):
       user_id = session.get("user_id")
       product_quantity = request.json.get("quantity", 1)
       product = Product.query.get(product_id)

       if product:
           new_cart_product = Cart(user_id=user_id, product_id=product_id, product_quantity=product_quantity)

           db.session.add(new_cart_product)
           db.session.commit()

           return make_response(jsonify({"message": "Product added to cart"}), 201)
       else:
            return make_response(jsonify({"message": "Product not found"}), 404)


api.add_resource(Cart_Product, "/cart/products/<int:product_id>")

class Cart_Product_By_Id(Resource):
    @check_login
    def delete(self, cart_product_id):
        try:
            user_id = session.get("user_id")
            cart_product = Cart.query.filter_by(id=cart_product_id, user_id=user_id).first()

            if cart_product:
                db.session.delete(cart_product)
                db.session.commit()
                return make_response(jsonify({"message": "Cart item removed successfully"}), 200)
            else:
                return make_response(jsonify({"message": "Cart item not found"}), 404)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

    @check_login
    def patch(self, cart_product_id):
        try:
            user_id = session.get("user_id")
            cart_product = Cart.query.filter_by(id=cart_product_id, user_id=user_id).first()

            if cart_product:
                parser = reqparse.RequestParser()
                parser.add_argument('quantity', type=int, required=True)
                data = parser.parse_args()

                new_quantity = data['quantity']

                cart_product.product_quantity = new_quantity
                db.session.commit()

                return make_response(jsonify({"message": "Cart item quantity updated successfully"}), 200)
            else:
                return make_response(jsonify({"message": "Cart item not found"}), 404)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)

api.add_resource(Cart_Product_By_Id, "/cart/products/<int:cart_product_id>")

class ProductReviews(Resource):
    @check_login
    def post(self, product_id):
        data = request.get_json()
        user_id = session.get("user_id")

        try:
            title = data.get("title")
            body = data.get("body")
            rating = data.get("rating")

            review = Review(
                title=title,
                body=body,
                rating=rating,
                user_id=user_id,
                product_id=product_id,
            )

            db.session.add(review)
            db.session.commit()

            return make_response({'message': 'Review added successfully'}, 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'message': 'Error occurred', 'error': str(e)}, 500)

    def get(self, product_id):
        reviews = Review.query.filter_by(product_id=product_id).all()
        review_list = []

        for review in reviews:
            review_dict = review.to_dict()
            review_list.append(review_dict)

        return make_response(jsonify(review_list), 200)

api.add_resource(ProductReviews, '/product/<int:product_id>/reviews')

@app.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username = username).first()

    if user and user.password_check(password):
        session["user_id"] = user.id
        return user.to_dict(), 200
    else:
        return {"error": "Incorrect username or password"}, 401


@app.route("/signout", methods=["GET"])
def signout():
    session.clear()
    message = jsonify("You are signed out."), 200
    return message


class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = User.query.filter(User.id==user_id).first()
            if user:
                return user.to_dict(), 200
            else:
                return {"message": "User does not exist."}, 404
        else:
            return {"message": "Please sign in first."}, 401

api.add_resource(CheckSession, "/check_session")

if __name__ == "__main__":
    app.run(debug=True, port=5555)