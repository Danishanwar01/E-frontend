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
      .then((r) => {
        setProduct(r.data);
        setSelectedSize(r.data.sizes[0] || '');
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const adjustQty = (dir) => setQuantity((q) => Math.max(1, dir === 'up' ? q + 1 : q - 1));

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-error">
        <h2>Product not found</h2>
        <p>Sorry, we couldn’t find the product you’re looking for.</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  const { title, description, price, discount, colors, sizes, images, category, subcategory } = product;
  const finalPrice = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price;

  return (
    <div className="pd-container">
      <button className="pd-back" onClick={() => navigate(-1)}>
        ← Continue Shopping
      </button>

      <div className="pd-grid">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-main-img">
            <img src={`http://localhost:5000${images[selectedImage]}`} alt={`${title} - Main view`} />
            {discount > 0 && <div className="pd-discount">-{discount}%</div>}
          </div>
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`pd-thumb ${i === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(i)}
                aria-label={`View image ${i + 1} of ${title}`}
              >
                <img src={`http://localhost:5000${img}`} alt={`${title} - Thumbnail ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <h1 className="pd-title">{title}</h1>
          <div className="pd-meta">
            <span>{category.name}</span> • <span>{subcategory.name}</span>
          </div>

          <div className="pd-pricing">
            <div className="pd-final">₹{finalPrice}</div>
            {discount > 0 && <div className="pd-original">₹{price}</div>}
          </div>
          <div className="pd-tax">Inclusive of all taxes</div>

          <div className="pd-variants">
            <div className="pd-variant-group">
              <div className="pd-variant-label">Size</div>
              <div className="pd-sizes">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`pd-size-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                    aria-pressed={selectedSize === sz}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
            <div className="pd-variant-group">
              <div className="pd-variant-label">Color</div>
              <div className="pd-colors">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="pd-color-swatch"
                    style={{ backgroundColor: color }}
                    aria-label={`Color: ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pd-quantity">
            <div className="pd-variant-label">Quantity</div>
            <div className="pd-qty-controls">
              <button onClick={() => adjustQty('down')} aria-label="Decrease quantity">
                –
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                aria-label="Quantity"
              />
              <button onClick={() => adjustQty('up')} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <div className="pd-actions">
            <button className="btn add-cart">Add to Cart</button>
            <button className="btn buy-now">Buy Now</button>
          </div>

          <div className="pd-desc">
            <h3>Product Details</h3>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}