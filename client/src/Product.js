import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function Product() {
  const { productId } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ title: '', body: '', rating: 0 });
  const [addToCartMessage, setAddToCartMessage] = useState('');

  useEffect(() => {
    fetch(`/product/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });

    fetch(`/product/${productId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [productId]);

  const handleAddToCart = (productId) => {
    fetch(`/cart/products/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: 1 }),
    })
      .then((response) => {
        if (response.status === 201) {
          setAddToCartMessage('Product added to cart.');
        } else {
          console.error('Failed to add product to cart.');
        }
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
  };

  const isLoggedIn = true;
  const handleSubmitReview = () => {
    if (!isLoggedIn) {
      history.push('/signin');
      return;
    }

    fetch(`/product/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userReview),
    })
      .then((response) => {
        if (response.status === 201) {
          setUserReview({ title: '', body: '', rating: 0 });
          fetch(`/product/${productId}/reviews`)
            .then((res) => res.json())
            .then((data) => {
              setReviews(data);
            })
            .catch((error) => {
              console.error('Fetch error:', error);
            });
        } else {
          console.error('Failed to add a review.');
        }
      })
      .catch((error) => {
        console.error('Error adding a review:', error);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} className="img-fluid" alt={product.title} />
        </div>
        <div className="col-md-6">
          <h1>{product.title}</h1>
          <p>Price: ${product.price}</p>
          <p>Description: {product.description}</p>
          <button className="btn btn-primary" onClick={() => handleAddToCart(product.id)}>
            Add to Cart
          </button>
          <p>{addToCartMessage}</p>
          <h2>Leave a Review</h2>
          <div className="mb-3">
            <label htmlFor="reviewTitle" className="form-label">Title:</label>
            <input
              type="text"
              id="reviewTitle"
              name="title"
              value={userReview.title}
              onChange={(e) => setUserReview({ ...userReview, title: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="reviewBody" className="form-label">Description:</label>
            <textarea
              id="reviewBody"
              name="body"
              value={userReview.body}
              onChange={(e) => setUserReview({ ...userReview, body: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="reviewRating" className="form-label">Rating (out of 5):</label>
            <input
              type="number"
              id="reviewRating"
              name="rating"
              value={userReview.rating}
              onChange={(e) => setUserReview({ ...userReview, rating: e.target.value })}
              className="form-control"
              min="1"
              max="5"
              required
            />
          </div>
          <button className="btn btn-primary" onClick={handleSubmitReview}>
            Submit Review
          </button>

          <h2>Product Reviews</h2>
          <ul className="list-group">
            {reviews.map((review) => (
              <li key={review.id} className="list-group-item">
                <h5 className="mb-0">{review.user.username}</h5>
                <p>Title: {review.title}</p>
                <p>Description: {review.body}</p>
                <p>Rating: {review.rating} out of 5</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Product;
