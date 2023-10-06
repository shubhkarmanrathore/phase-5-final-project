import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

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
    fetch('/users')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setUserInfo(data[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching user information:', error);
      });
  }, []);

  const handleCVVInputChange = (e) => {
    const newCVV = e.target.value;
    setCVV(newCVV);
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
      .then((res) => res.json())
      .then((data) => {
        if (data && data.message === 'Order placed successfully') {
          history.push('/my_orders');
        }
      })
      .catch((error) => {
        console.error('Error placing order:', error);
      });
  };

  return (
    <div className="container">
      <h1 className="mt-5">Checkout</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input type="text" className="form-control" id="name" value={userInfo.name} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" value={userInfo.email} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" value={userInfo.address} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="payment_card" className="form-label">Payment Card</label>
          <input type="text" className="form-control" id="payment_card" value={userInfo.payment_card} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="cvv" className="form-label">Card CVV</label>
          <input type="text" className="form-control" id="cvv" onChange={handleCVVInputChange} />
        </div>
        <button className="btn btn-primary" onClick={placeOrder}>Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;
