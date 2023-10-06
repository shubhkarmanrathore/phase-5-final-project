import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkSession = () => {
    fetch('/check_session')
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.error('Error checking user session:', error);
      });
  };

  useEffect(() => {
    checkSession();
    fetch('/my_orders')
      .then((res) => res.json())
      .then((data) => {
        const promises = data.map((order) => {
          return Promise.all([
            fetch(`/users/${order.user_id}`).then((res) => res.json()),
            fetch(`/product/${order.product_id}`).then((res) => res.json()),
          ]);
        });

        return Promise.all(promises)
          .then((results) => {
            return data.map((order, index) => {
              const [user, product] = results[index];
              return {
                ...order,
                user_name: user.name,
                product_name: product.title,
                product_image: product.image,
                product_price: product.price,
              };
            });
          })
          .catch((error) => {
            console.error('Error fetching user and product details:', error);
            return data;
          });
      })
      .then((finalData) => {
        setOrders(finalData);
      })
      .catch((error) => {
        console.error('Error fetching user orders:', error);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="mt-5">My Orders</h1>
      {isLoggedIn ? (
        orders.length > 0 ? (
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Product Name</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Order Status</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product_name}</td>
                  <td>
                    <img
                      src={order.product_image}
                      alt={order.product_name}
                      style={{ width: '50px', height: '50px' }}
                    />
                  </td>
                  <td>{order.product_quantity}</td>
                  <td>${order.product_price}</td>
                  <td>{order.order_status}</td>
                  <td>${order.product_quantity * order.product_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mt-4">
            <p>You have no orders yet.</p>
          </div>
        )
      ) : (
        <div className="mt-4">
          <p>Please login first to view your orders.</p>
          <Link to="/signin" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
