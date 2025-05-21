import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import '../styles/Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart from backend
  useEffect(() => {
    async function loadCart() {
      try {
        const userRes = JSON.parse(localStorage.getItem('user') || '{}');
        const res = await fetch(`http://localhost:5000/api/cart/${userRes.id}`);
        const items = await res.json();
        setCartItems(items);

        // Fetch product details
        const details = {};
        await Promise.all(
          items.map(item =>
            fetchProductById(item.productId)
              .then(r => details[item.productId] = r.data)
              .catch(console.error)
          )
        );
        setProducts(details);
      } catch (e) {
        console.error(e);
        setError('Please Login First');
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  // Update quantity and persist to backend
  const updateQty = async (pid, size, color, delta) => {
    const next = cartItems.map(item =>
      item.productId === pid && item.size === size && item.color === color
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    );
    setCartItems(next);

    const userRes = JSON.parse(localStorage.getItem('user') || '{}');
    await fetch(`http://localhost:5000/api/cart/${userRes.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: next })
    });
  };

  // Remove item and persist
  const removeItem = async (pid, size, color) => {
    const next = cartItems.filter(
      item => !(item.productId === pid && item.size === size && item.color === color)
    );
    setCartItems(next);

    const userRes = JSON.parse(localStorage.getItem('user') || '{}');
    await fetch(`http://localhost:5000/api/cart/${userRes.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: next })
    });
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-error">
        <p>{error}</p>
        <button className="btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = cartItems.reduce((sum, { productId, qty }) => {
    const p = products[productId];
    if (!p) return sum;
    const unit = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return sum + unit * qty;
  }, 0);

  // show newest first
  const orderedItems = [...cartItems].reverse();

  return (
    <div className="cart-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="cart-title">Products in Cart {totalCount}</h1>

      {orderedItems.length === 0 ? (
        <div className="empty-cart">
          <p className="empty-text">Your cart is empty</p>
          <button className="btn browse-btn" onClick={() => navigate('/')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {orderedItems.map(({ productId, qty, size, color }) => {
              const p = products[productId];
              if (!p) return null;
              const unitPrice = (
                p.discount ? p.price * (1 - p.discount / 100) : p.price
              ).toFixed(2);
              const lineTotal = (unitPrice * qty).toFixed(2);

              return (
                <div
                  className="cart-item"
                  key={`${productId}-${size}-${color}`}
                  onClick={() => navigate(`/product/${productId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    className="item-img"
                    src={`http://localhost:5000${p.images[0]}`}
                    alt={p.title}
                  />
                  <div className="item-info">
                    <h3 className="item-title">{p.title}</h3>
                    <div className="price">₹{unitPrice}</div>
                    <div className="variants">
                      {size && <span className="variant-text">Size: {size}</span>}
                      {color && (
                        <div className="color-container">
                          Color:
                          <div
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={e => {
                          e.stopPropagation();
                          updateQty(productId, size, color, -1);
                        }}
                      >
                        −
                      </button>

                      <span className="qty-count">{qty}</span>

                      <button
                        className="qty-btn"
                        onClick={e => {
                          e.stopPropagation();
                          updateQty(productId, size, color, 1);
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={e => {
                        e.stopPropagation();
                        removeItem(productId, size, color);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  {/* <div className="item-total">₹{lineTotal}</div> */}
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span className="summary-label">Subtotal:</span>
              <span className="summary-value">₹{grandTotal.toFixed(2)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
