import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Product() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/product/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProduct(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [productId]);

  const handleAddToCart = () => {
    console.log(`Added product ${productId} to the cart`);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            className="img-fluid"
            alt={product.title}
          />
        </div>
        <div className="col-md-6">
          <h1>{product.title}</h1>
          <p>Price: ${product.price}</p>
          <p>Description: {product.description}</p>

          <button className="btn btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
