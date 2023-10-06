import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('/cart/user')
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.cart_items);
      });
  }, []);

  const updateQuantity = (cartItemId, newQuantity) => {
    fetch(`/cart/products/${cartItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: newQuantity }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Update the local state with the new quantity
          setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
              item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
          );
        } else {
          alert('Failed to update quantity.');
        }
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
        alert('An error occurred while updating the quantity.');
      });
  };

  const removeFromCart = (cartItemId) => {
    fetch(`/cart/products/${cartItemId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 200) {
          // Remove the item from local state
          setCartItems((prevCartItems) =>
            prevCartItems.filter((item) => item.id !== cartItemId)
          );
        } else {
          alert('Failed to remove item from cart.');
        }
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
        alert('An error occurred while removing the item from the cart.');
      });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  };

  return (
    <div className="container">
      <h1 className="mt-5">Shopping Cart</h1>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Product</th>
            <th>Image</th> {/* Add Image Column */}
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>{cartItem.product.title}</td>
              <td>
                <img
                  src={cartItem.product.image}
                  alt={cartItem.product.title}
                  style={{ width: '50px', height: '50px' }}
                />
              </td> {/* Display Product Image */}
              <td>
                <select
                  value={cartItem.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    updateQuantity(cartItem.id, newQuantity);
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
              </td>
              <td>${cartItem.product.price}</td>
              <td>${cartItem.quantity * cartItem.product.price}</td>
              <td>
                <button
                  onClick={() => removeFromCart(cartItem.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Total: ${calculateTotal()}</h3>
        <NavLink to="/checkout" className="btn btn-primary" activeClassName="active-link">Checkout</NavLink>

      </div>
    </div>
  );
}

export default CartPage;
