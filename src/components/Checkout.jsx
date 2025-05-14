// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProductById }          from '../api/products';
import '../styles/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 1) Determine initial items (Buy Now vs Cart)
  const initialItems = Array.isArray(state)
    ? state
    : JSON.parse(localStorage.getItem('cart')) || [];

  const [cartItems,   setCartItems]   = useState(initialItems);
  const [products,    setProducts]    = useState({});
  const [loading,     setLoading]     = useState(true);
  const [form,        setForm]        = useState({
    name: '', email: '', address: '', city: '', country: '',
    postalCode: '', contact: '', cardNumber: '', expDate: '', cvv: ''
  });
  const [errors,      setErrors]      = useState({});
  const [orderSuccess,setOrderSuccess]= useState(false);

  // 2) Load product details
  useEffect(() => {
    async function loadDetails() {
      const details = {};
      await Promise.all(
        cartItems.map(item =>
          fetchProductById(item.productId)
            .then(res => details[item.productId] = res.data)
            .catch(console.error)
        )
      );
      setProducts(details);
      setLoading(false);
    }
    loadDetails();
  }, [cartItems]);

  // 3) Form handling
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid';
    if (!form.address) errs.address = 'Required';
    if (!form.city) errs.city = 'Required';
    if (!form.country) errs.country = 'Required';
    if (!/^\d{6}$/.test(form.postalCode)) errs.postalCode = 'Invalid';
    if (!form.contact) errs.contact = 'Required';
    if (!/^\d{16}$/.test(form.cardNumber)) errs.cardNumber = '16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expDate)) errs.expDate = 'MM/YY';
    if (!/^\d{3}$/.test(form.cvv)) errs.cvv = '3 digits';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 4) Submit handler: fake order placement
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    // Compute subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const p    = products[item.productId];
      const unit = p.discount ? p.price * (1 - p.discount/100) : p.price;
      return sum + unit * item.qty;
    }, 0);

    // Build payload
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const payload = {
      userId:      user.id,
      items:       cartItems,
      shipping:    {
        name:       form.name,
        email:      form.email,
        address:    form.address,
        city:       form.city,
        country:    form.country,
        postalCode: form.postalCode,
        contact:    form.contact
      },
      totalAmount: subtotal
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Order failed');
      // clear local cart (unless Buy Now)
      if (!Array.isArray(state)) localStorage.removeItem('cart');
      setOrderSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Could not place order');
    }
  };

  // 5) Loading and success states
  if (loading) {
    return <div className="cart-loading">
      <div className="spinner"></div>
      <p>Loading checkout...</p>
    </div>;
  }
  if (orderSuccess) {
    return <div className="order-success">
      <h2>Order Placed Successfully! 🎉</h2>
      <button onClick={() => navigate('/')}>Continue Shopping</button>
    </div>;
  }

  // 6) Render form + summary
  const subtotal = cartItems.reduce((sum, item) => {
    const p    = products[item.productId];
    const unit = p.discount ? p.price * (1 - p.discount/100) : p.price;
    return sum + unit * item.qty;
  }, 0);

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-grid">

        {/* Shipping & Payment Form */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping & Payment</h2>
          {[
            ['name','Full Name'],
            ['email','Email'],
            ['address','Address'],
            ['city','City'],
            ['country','Country'],
            ['postalCode','PIN Code'],
            ['contact','Contact'],
            ['cardNumber','Card Number'],
            ['expDate','Expiry (MM/YY)'],
            ['cvv','CVV']
          ].map(([field,label]) => (
            <div className="form-group" key={field}>
              <label>{label}</label>
              <input
                name={field}
                type={(field==='cardNumber'||field==='cvv')?'password':'text'}
                value={form[field]}
                onChange={handleChange}
                className={errors[field] ? 'error' : ''}
              />
              {errors[field] && <span className="error-msg">{errors[field]}</span>}
            </div>
          ))}
          <button type="submit" className="checkout-btn">
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => {
            const p = products[item.productId];
            if (!p) return null;
            const unit = (p.discount ? p.price * (1 - p.discount/100) : p.price).toFixed(2);
            return (
              <div className="order-item"
                   key={`${item.productId}-${item.size}-${item.color}`}>
                <img src={`http://localhost:5000${p.images[0]}`}
                     alt={p.title}
                     width={50} />
                <div className="item-details">
                  <h4>{p.title}</h4>
                  <p>Qty: {item.qty}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && (
                    <div className="color-swatch"
                         style={{ backgroundColor: item.color }} />
                  )}
                </div>
                <div className="item-price">
                  ₹{(unit * item.qty).toFixed(2)}
                </div>
              </div>
            );
          })}
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </aside>

      </div>
    </div>
  );
}
