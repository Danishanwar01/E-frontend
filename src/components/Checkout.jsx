import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation }      from 'react-router-dom';
import { fetchProductById }              from '../api/products';
import '../styles/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [cartItems,    setCartItems]    = useState([]);
  const [products,     setProducts]     = useState({});
  const [loading,      setLoading]      = useState(true);
  const [form,         setForm]         = useState({
    name:'', email:'', address:'', city:'', country:'',
    postalCode:'', contact:'', cardNumber:'', expDate:'', cvv:''
  });
  const [errors,       setErrors]       = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  // 1) Load cart items either from state (Buy Now) or backend
  useEffect(() => {
    async function loadCart() {
      let items = state && Array.isArray(state) ? state : [];
      if (!Array.isArray(state)) {
        const userRes = JSON.parse(localStorage.getItem('user') || '{}');
        const res     = await fetch(`http://localhost:5000/api/cart/${userRes.id}`);
        items = await res.json();
      }
      setCartItems(items);

      const details = {};
      await Promise.all(
        items.map(item =>
          fetchProductById(item.productId)
            .then(r => details[item.productId] = r.data)
            .catch(console.error)
        )
      );
      setProducts(details);
      setLoading(false);
    }
    loadCart();
  }, [state]);

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

  // 2) Place fake order
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    const subtotal = cartItems.reduce((sum,item) => {
      const p    = products[item.productId];
      const unit = p.discount ? p.price*(1-p.discount/100) : p.price;
      return sum + unit*item.qty;
    }, 0);

    const userRes = JSON.parse(localStorage.getItem('user') || '{}');
    const payload = {
      userId:       userRes.id,
      items:        cartItems,
      shipping:     {
        name:        form.name,
        email:       form.email,
        address:     form.address,
        city:        form.city,
        country:     form.country,
        postalCode:  form.postalCode,
        contact:     form.contact
      },
      totalAmount:  subtotal
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      // clear backend cart if not Buy Now
      if (!Array.isArray(state)) {
        await fetch(`http://localhost:5000/api/cart/${userRes.id}`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ items: [] })
        });
      }
      setOrderSuccess(true);
    } catch {
      alert('Could not place order');
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="order-success">
        <h2>Order Placed Successfully! 🎉</h2>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum,item) => {
    const p    = products[item.productId];
    const unit = p.discount ? p.price*(1-p.discount/100) : p.price;
    return sum + unit*item.qty;
  }, 0);

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-grid">

        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping & Payment</h2>
          {[
            ['name','Full Name'],['email','Email'],
            ['address','Address'],['city','City'],['country','Country'],
            ['postalCode','PIN Code'],['contact','Contact'],
            ['cardNumber','Card Number'],['expDate','Expiry (MM/YY)'],['cvv','CVV']
          ].map(([f,lab]) => (
            <div className="form-group" key={f}>
              <label>{lab}</label>
              <input
                name={f}
                type={(f==='cardNumber'||f==='cvv')?'password':'text'}
                value={form[f]}
                onChange={handleChange}
                className={errors[f] ? 'error' : ''}
              />
              {errors[f] && <span className="error-msg">{errors[f]}</span>}
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
            const unit = (p.discount ? p.price*(1-p.discount/100) : p.price).toFixed(2);
            return (
              <div className="order-item" key={`${item.productId}-${item.size}-${item.color}`}>
                <img src={`http://localhost:5000${p.images[0]}`} alt={p.title} width={50}/>
                <div className="item-details">
                  <h4>{p.title}</h4>
                  <p>Qty: {item.qty}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <div className="color-swatch" style={{backgroundColor: item.color}}/>}
                </div>
                <div className="item-price">₹{(unit * item.qty).toFixed(2)}</div>
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
