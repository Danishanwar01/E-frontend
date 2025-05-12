import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    fetchProductById(id)
      .then(r => {
        setProduct(r.data);
        setSelectedSize(r.data.sizes[0] || '');
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleQuantity = (type) => {
    setQuantity(prev => Math.max(1, type === 'inc' ? prev + 1 : prev - 1));
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const { title, description, price, discount, colors, sizes, images, category, subcategory } = product;
  const finalPrice = discount > 0 ? (price * (1 - discount/100)).toFixed(2) : price;

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <span>‹</span> Continue Shopping
      </button>

      <div className="product-layout">
        {/* Image Gallery */}
        <div className="gallery-section">
          <div className="main-image">
            <img 
              src={`http://localhost:5000${images[selectedImage]}`} 
              alt={title} 
              className="product-hero" 
            />
            {discount > 0 && (
              <div className="discount-badge">-{discount}%</div>
            )}
          </div>
          
          <div className="thumbnail-grid">
            {images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000${img}`}
                alt={`${title} - ${i + 1}`}
                className={`thumbnail ${i === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="info-section">
          <div className="product-header">
            <h1>{title}</h1>
            <div className="product-meta">
              <span className="category">{category.name}</span>
              <span className="divider">•</span>
              <span className="subcategory">{subcategory.name}</span>
            </div>
          </div>

          <div className="price-container">
            <div className="price-wrapper">
              <span className="final-price">₹{finalPrice}</span>
              {discount > 0 && (
                <span className="original-price">₹{price}</span>
              )}
            </div>
            <div className="tax-info">Inclusive of all taxes</div>
          </div>

          <div className="variant-selector">
            <div className="size-selector">
              <h3>Select Size</h3>
              <div className="size-grid">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="color-selector">
              <h3>Available Colors</h3>
              <div className="color-grid">
                {colors.map(color => (
                  <div 
                    key={color}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="quantity-selector">
            <h3>Quantity</h3>
            <div className="qty-controls">
              <button onClick={() => handleQuantity('dec')}>−</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantity('inc')}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart">Add to Cart</button>
            <button className="buy-now">Buy Now</button>
          </div>

          <div className="product-description">
            <h3>Product Details</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}