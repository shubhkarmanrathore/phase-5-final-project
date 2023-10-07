import React from 'react';
import { NavLink } from 'react-router-dom';

function HomePage({ products }) {
  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {products.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.title}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">Price: ${product.price}</p>
              </div>
              <div className="card-footer">
                <NavLink
                  to={`/product/${product.id}`}
                  className="btn btn-primary"
                >
                  View Product
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
