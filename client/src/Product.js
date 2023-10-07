import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

function Product() {
  const { productId } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ title: '', body: '', rating: 0 });
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

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

        const totalRating = data.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = data.length > 0 ? totalRating / data.length : 0;
        setAverageRating(avgRating);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [productId]);

  const handleAddToCart = (productId) => {
    if (!isLoggedIn) {
      alert('Please log in to add this product to your cart.');
      history.push('/signin');
      return;
    }
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

  useEffect(() => {
    fetch('/check_session')
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error('Error checking session:', error);
      });
  }, []);

  const handleSubmitReview = () => {
    if (!isLoggedIn) {
      alert('Please log in to leave a review.');
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

              const totalRating = data.reduce((acc, review) => acc + review.rating, 0);
              const avgRating = data.length > 0 ? totalRating / data.length : 0;
              setAverageRating(avgRating);
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
          <img src={product.image} className="img-fluid img-thumbnail" alt={product.title} />
        </div>
        <div className="col-md-6">
          <h1>{product.title}</h1>
          <p>Price: ${product.price}</p>
          <p>Description: {product.description}</p>
          <button className="btn btn-primary" onClick={() => handleAddToCart(product.id)}>
            Add to Cart
          </button>
          <p>{addToCartMessage}</p>
          <div className="row mt-5">
            <h2>Leave a Review</h2>
          </div>
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
            <select
              id="reviewRating"
              name="rating"
              value={userReview.rating}
              onChange={(e) => setUserReview({ ...userReview, rating: e.target.value })}
              className="form-control"
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-12">
          <h2>Product Reviews</h2>
          <p>Overall Rating: {averageRating.toFixed(2)} out of 5</p>
          {reviews.map((review) => (
            <div key={review.id} className="col-md-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{review.title}</h5>
                  <p className="card-text text-left">{review.body}</p>
                  <p className="card-text text-left">Rating: {review.rating} out of 5</p>
                </div>
                <div className="card-footer">{review.user.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
