import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email:'',password:'' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 6) errs.password = 'At least 6 characters';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    fetch('http://localhost:5000/api/userdata/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.user?.id) {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate(`/profile/${data.user.id}`);
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Login failed');
      });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-heading">Login</h2>
        {[
          ['email','Email'],
          ['password','Password']
        ].map(([field,label]) => (
          <div className="form-group" key={field}>
            <label>{label}</label>
            <input
              type={field==='password'?'password':'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className={errors[field]?'error':''}
            />
            {errors[field] && <span className="error-msg">{errors[field]}</span>}
          </div>
        ))}
        <button type="submit" className="btn auth-btn">Login</button>
        <p className="auth-switch">
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </form>
    </div>
  );
}
