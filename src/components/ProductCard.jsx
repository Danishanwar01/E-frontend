import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0]
    ? `http://localhost:5000${product.images[0]}`
    : 'https://via.placeholder.com/300x400';
  const discountedPrice = product.discount
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="image-wrapper">
        <img src={imageUrl} alt={product.title} loading="lazy" />
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-title">{product.title}</h3>
        <div className="price-section">
          {discountedPrice ? (
            <>
              <span className="original-price">₹{product.price}</span>
              <span className="discounted-price">₹{discountedPrice}</span>
            </>
          ) : (
            <span className="normal-price">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
