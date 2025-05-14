import React, { useState, useEffect } from 'react';
import { useNavigate, useParams }     from 'react-router-dom';
import '../styles/Auth.css';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user,    setUser]    = useState(null);
  const [form,    setForm]    = useState({
    name: '', password: '', address: '', city: '', country: '', postalCode: '', phone: ''
  });
  const [message, setMessage] = useState('');
  const [orders,  setOrders]  = useState([]);

  // 1) Load profile
  useEffect(() => {
    fetch(`http://localhost:5000/api/userdata/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setForm({
          name:       data.name || '',
          password:   '',
          address:    data.address || '',
          city:       data.city || '',
          country:    data.country || '',
          postalCode: data.postalCode || '',
          phone:      data.phone || ''
        });
      })
      .catch(console.error);
  }, [id]);

  // 2) Load orders
  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleUpdate = e => {
    e.preventDefault();
    // only send changed fields
    const updates = { ...form };
    if (!updates.password) delete updates.password;

    fetch(`http://localhost:5000/api/userdata/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(updates)
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setMessage('Profile updated successfully!');
        setForm(f => ({ ...f, password: '' }));
      })
      .catch(err => {
        console.error(err);
        setMessage('Update failed');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <p>Loading profile…</p>;

  return (
    <div className="auth-container">
      {/* Profile Form */}
      <form className="auth-form" onSubmit={handleUpdate}>
        <h2 className="auth-heading">My Profile</h2>

        {[
          ['name','Full Name'],
          // email is read-only
        ].map(([field,label]) => (
          <div className="form-group" key={field}>
            <label>{label}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Email (read-only)</label>
          <input value={user.email} readOnly />
        </div>

        {['address','city','country','postalCode','phone'].map(field => (
          <div className="form-group" key={field}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep old"
          />
        </div>

        <button type="submit" className="btn auth-btn">
          Update Profile
        </button>
        {message && <p className="error-msg">{message}</p>}
      </form>

      {/* Logout */}
      <button
        className="btn auth-btn"
        onClick={handleLogout}
        style={{ margin: '1rem auto', display: 'block', maxWidth: '400px' }}
      >
        Logout
      </button>

      {/* Orders List */}
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>No past orders.</p>
        ) : (
          orders.map((order, idx) => (
            <div
              key={order._id}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            >
              <h3>
                Order #{idx + 1} — ₹{order.totalAmount.toFixed(2)}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul>
                {order.items.map((it, j) => (
                  <li key={j}>
                    {it.productId.title} ×{it.qty}
                    {it.size && `, Size: ${it.size}`}
                    {it.color && `, Color: ${it.color}`}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
