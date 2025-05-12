/* Cart.jsx */
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

  useEffect(() => {
    async function loadCart() {
      let stored = [];
      try {
        const raw = localStorage.getItem('cart');
        stored = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Cart parse error:', e);
      }
      const sanitized = stored.map(item => ({ ...item, qty: Number(item.qty) || 0 }));
      setCartItems(sanitized);

      const details = {};
      try {
        await Promise.all(
          sanitized.map(item =>
            !details[item.productId]
              ? fetchProductById(item.productId)
                  .then(res => { details[item.productId] = res.data; })
                  .catch(err => console.error(`Fetch product error ${item.productId}:`, err))
              : Promise.resolve()
          )
        );
      } catch {
        setError('Error loading some products');
      } finally {
        setProducts(details);
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  const updateQty = (pid, size, color, delta) => {
    const next = cartItems.map(item =>
      item.productId === pid && item.size === size && item.color === color
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    );
    setCartItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const removeItem = (pid, size, color) => {
    const next = cartItems.filter(
      item => !(item.productId === pid && item.size === size && item.color === color)
    );
    setCartItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  if (loading) return <div className="cart-loading"><div className="spinner"></div><p>Loading your cart...</p></div>;
  if (error) return <div className="cart-error"><p>{error}</p><button onClick={() => window.location.reload()}>Retry</button></div>;

  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = cartItems.reduce((sum, { productId, qty }) => {
    const p = products[productId];
    if (!p) return sum;
    const unit = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return sum + unit * qty;
  }, 0);

  return (
    <div className="cart-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Continue Shopping</button>
      <h1>Your Shopping Cart ({totalCount})</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="btn" onClick={() => navigate('/')}>Browse Products</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(({ productId, qty, size, color }) => {
              const p = products[productId];
              if (!p) return null;
              const unitPrice = (p.discount
                ? p.price * (1 - p.discount / 100)
                : p.price
              ).toFixed(2);
              const lineTotal = (unitPrice * qty).toFixed(2);

              return (
                <div className="cart-item" key={`${productId}-${size}-${color}`}>  
                  <img src={`http://localhost:5000${p.images[0]}`} alt={p.title} />
                  <div className="item-info">
                    <h3>{p.title}</h3>
                    <div className="price">₹{unitPrice}</div>
                    <div className="variants">
                      {size && <span>Size: {size}</span>}
                      {color && (
                        <div className="color-container">
                          Color:
                          <div className="color-swatch" style={{ backgroundColor: color }} />
                        </div>
                      )}
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => updateQty(productId, size, color, -1)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => updateQty(productId, size, color, 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(productId, size, color)}>
                      Remove
                    </button>
                  </div>
                  <div className="item-total">₹{lineTotal}</div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row"><span>Subtotal:</span><span>₹{grandTotal.toFixed(2)}</span></div>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}