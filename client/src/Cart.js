import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    fetch('/check_session')
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);

          // If the user is logged in, fetch the cart items
          fetch('/cart/user')
            .then((res) => res.json())
            .then((data) => {
              // Set the initial quantity to 1 for each cart item
              const cartItemsWithInitialQuantity = data.cart_items.map((item) => ({
                ...item,
                quantity: 1,
              }));
              setCartItems(cartItemsWithInitialQuantity);
              setIsLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching cart items:', error);
              setIsLoading(false);
            });
        } else {
          setIsLoggedIn(false);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error checking session:', error);
        setIsLoading(false);
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
      {isLoading ? (
        <p>Loading...</p>
      ) : isLoggedIn ? (
        cartItems.length > 0 ? (
          <>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
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
                    </td>
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
              <NavLink to="/checkout" className="btn btn-primary" activeClassName="active-link">
                Checkout
              </NavLink>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )
      ) : (
        <div className="mt-4">
          <p>Please login first to start shopping.</p>
          <button
            className="btn btn-primary"
            onClick={() => history.push('/signin')}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
