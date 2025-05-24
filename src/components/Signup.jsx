import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export function Signup() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({
    name:'',email:'',password:'',confirm:'',
    address:'',city:'',country:'',postalCode:'',phone:''
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords must match';
    // no extra validation for address/etc if optional
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    fetch('https://e-backend-rf04.onrender.com/api/userdata/signup', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          localStorage.setItem('user', JSON.stringify({ id:data.id, name: form.name, email: form.email }));
          navigate(`/profile/${data.id}`);
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Signup failed');
      });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-heading">Sign Up</h2>
        {[
          ['name','Full Name'],
          ['email','Email'],
          ['password','Password'],
          ['confirm','Confirm Password'],
          ['address','Address'],
          ['city','City'],
          ['country','Country'],
          ['postalCode','PIN Code'],
          ['phone','Phone']
        ].map(([field,label]) => (
          <div className="form-group" key={field}>
            <label>{label}</label>
            <input
              type={field.includes('password')?'password':'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className={errors[field]?'error':''}
              placeholder={field==='confirm'?'Re‑enter password':''}
            />
            {errors[field] && <span className="error-msg">{errors[field]}</span>}
          </div>
        ))}
        <button type="submit" className="btn auth-btn">Sign Up</button>
        <p className="auth-switch">
          Already have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
}
