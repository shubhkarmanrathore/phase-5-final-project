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
  const history = useHistory();

  useEffect(() => {
    // Check the user's session to get their user ID
    fetch('/check_session')
      .then((res) => res.json())
      .then((data) => {
        if (data.userId) {
          // If the session contains a user ID, fetch the user's information
          fetch(`/users/${data.userId}`)
            .then((res) => res.json())
            .then((userData) => {
              if (userData) {
                setUserInfo(userData);
              }
            })
            .catch((error) => {
              console.error('Error fetching user information:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error checking session:', error);
      });
  }, []);

  const handleCVVInputChange = (e) => {
    const newCVV = e.target.value;
    if (/^\d{0,3}$/.test(newCVV)) {
      setCVV(newCVV);
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
    <div className="container">
      <h1 className="mt-5">Checkout</h1>
      <div>
        <h2>User Information</h2>
        <p>
          <strong>Full Name:</strong> {userInfo.name}
        </p>
        <p>
          <strong>Email:</strong> {userInfo.email}
        </p>
        <p>
          <strong>Address:</strong> {userInfo.address}
        </p>
        <p>
          <strong>Payment Card:</strong> {userInfo.payment_card}
        </p>
      </div>
      <div>
        <h2>Review Order</h2>
      </div>
      <div className="mb-3">
        <label htmlFor="cvv" className="form-label">
          Card CVV (Max 3 digits)
        </label>
        <input type="text" className="form-control" id="cvv" value={cvv} onChange={handleCVVInputChange} />
      </div>
      <button className="btn btn-primary" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
