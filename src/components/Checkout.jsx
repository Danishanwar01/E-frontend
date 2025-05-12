
/* Checkout.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import '../styles/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', country: '', postalCode: '', cardNumber: '', expDate: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function loadCheckout() {
      let stored = [];
      try {
        const raw = localStorage.getItem('cart');
        stored = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Cart parse error:', e);
      }
      setCartItems(stored);
      const details = {};
      await Promise.all(
        stored.map(item =>
          !details[item.productId]
            ? fetchProductById(item.productId)
                .then(res => { details[item.productId] = res.data; })
                .catch(err => console.error(`Fetch product error ${item.productId}:`, err))
            : Promise.resolve()
        )
      );
      setProducts(details);
      setLoading(false);
    }
    loadCheckout();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Required';
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = 'Invalid';
    if (!form.address) errs.address = 'Required';
    if (!form.city) errs.city = 'Required';
    if (!form.country) errs.country = 'Required';
    if (!form.postalCode.match(/^\d{6}$/)) errs.postalCode = 'Invalid';
    if (!form.cardNumber.match(/^\d{16}$/)) errs.cardNumber = '16 digits';
    if (!form.expDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) errs.expDate = 'MM/YY';
    if (!form.cvv.match(/^\d{3}$/)) errs.cvv = '3 digits';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    localStorage.removeItem('cart');
    setOrderSuccess(true);
  };

  if (loading) return <div className="cart-loading"><div className="spinner"></div><p>Loading checkout...</p></div>;
  if (orderSuccess) {
    return (
      <div className="order-success">
        <h2>Order Placed Successfully! 🎉</h2>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, { productId, qty }) => {
    const p = products[productId];
    if (!p) return sum;
    const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return sum + price * qty;
  }, 0);

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping & Payment</h2>
          {[['name','Full Name'],['email','Email'],['address','Address'],['city','City'],['country','Country'],['postalCode','PIN Code'],['cardNumber','Card Number'],['expDate','Expiry (MM/YY)'],['cvv','CVV']].map(([field,label]) => (
            <div className="form-group" key={field}>
              <label>{label}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className={errors[field] ? 'error' : ''}
              />
              {errors[field] && <span className="error-msg">{errors[field]}</span>}
            </div>
          ))}
          <button type="submit" className="checkout-btn">Place Order</button>
        </form>

        <aside className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => {
            const p = products[item.productId];
            if (!p) return null;
            const unit = (p.discount ? p.price * (1 - p.discount/100) : p.price).toFixed(2);
            return (
              <div className="order-item" key={`${item.productId}-${item.size}-${item.color}`}>  
                <img src={`http://localhost:5000${p.images[0]}`} alt={p.title} width={50} />
                <div className="item-details">
                  <h4>{p.title}</h4>
                  <p>Qty: {item.qty}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <div className="color-swatch" style={{backgroundColor: item.color}} />}
                </div>
                <div className="item-price">₹{(unit * item.qty).toFixed(2)}</div>
              </div>
            );
          })}
          <div className="summary-row total"><span>Total:</span><span>₹{subtotal.toFixed(2)}</span></div>
        </aside>
      </div>
    </div>
  );
}
