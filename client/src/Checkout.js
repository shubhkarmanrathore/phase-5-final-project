import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Checkout() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    payment_card: '',
    // Add more fields as needed
  });

  useEffect(() => {
    // Fetch user information from the backend and update state
    fetch('/users') // Assuming this endpoint returns user information
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array of users
        if (data && data.length > 0) {
          // We'll use the first user in this example
          setUserInfo(data[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching user information:', error);
      });
  }, []);

  const handleCVVInputChange = (e) => {
    // Handle CVV input change and update state
    const newCVV = e.target.value;
    // Update CVV in state or perform validation as needed
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
        {/* Add more user information fields as needed */}
        <div className="mb-3">
          <label htmlFor="cvv" className="form-label">Card CVV</label>
          <input type="text" className="form-control" id="cvv" onChange={handleCVVInputChange} />
        </div>
        <button className="btn btn-primary">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;
