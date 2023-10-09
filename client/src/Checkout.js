import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Checkout() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    payment_card: '',
  });
  const [cvv, setCVV] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch('/check_session')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('User not logged in');
        }
      })
      .then((data) => {
        const userId = data.id;
        console.log(data.id);
        fetch(`/users/${userId}`)
          .then((res) => res.json())
          .then((userData) => {
            if (userData) {
              setUserInfo(userData);
            }
          })
          .catch((error) => {
            console.error('Error fetching user information:', error);
          });
      })
      .catch((error) => {
        console.error('Error checking session:', error);
        history.push('/signin');
      });

    fetch('/cart/user')
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.cart_items);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }, [history]);

  const handleCVVInputChange = (e) => {
    const newCVV = e.target.value;
    if (/^\d{0,3}$/.test(newCVV)) {
      setCVV(newCVV);
    }
  };

  const formatPaymentCard = (cardNumber) => {
    if (cardNumber.length < 4) {
      return '**** **** **** ' + cardNumber;
    } else {
      const last4Digits = cardNumber.slice(-4);
      return '**** **** **** ' + last4Digits;
    }
  };

  const placeOrder = () => {
    const orderData = {
      name: userInfo.name,
      email: userInfo.email,
      address: userInfo.address,
      payment_card: userInfo.payment_card,
      cvv: cvv,
    };

    fetch('/post_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => {
        if (res.status === 201) {
          alert('Order Placed successfully');
          history.push('/my_orders');
        } else if (res.status === 401) {
          alert('Error placing order');
        }
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        alert('Error placing the order');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="card-title">Review Your Order</h1>
              <div className="mb-4">
                <h3>User Information</h3>
                <p>
                  <strong>Full Name:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Address:</strong> {userInfo.address}
                </p>
                <p>
                  <strong>Payment Card:</strong>{' '}
                  {formatPaymentCard(userInfo.payment_card)}
                </p>
              </div>
              <div>
                <h3>Card CVV</h3>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="cvv"
                    value={cvv}
                    onChange={handleCVVInputChange}
                    maxLength="3"
                    placeholder="Enter CVV"
                  />
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={placeOrder}
                disabled={cvv.length !== 3}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Review your order</h1>
              <ul className="list-group">
                {cartItems.map((item) => (
                  <li className="list-group-item" key={item.id}>
                    <strong>{item.product.title}</strong>
                    <p>Price: ${item.product.price}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
