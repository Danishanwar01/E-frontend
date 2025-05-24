import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../api/categories';
import userIcon from '../assets/images/user.svg';
import cartIcon from '../assets/images/cart.svg';
import '../styles/Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Sync user state from localStorage
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // Fetch categories
  useEffect(() => {
    fetchCategories()
      .then(res => setCats(res.data))
      .catch(console.error);
  }, []);

  // Compute cart count
  useEffect(() => {
    async function loadCount() {
      if (user?.id) {
        try {
          const res = await fetch(`http://localhost:5000/api/cart/${user.id}`);
          const items = await res.json();
          setCartCount(items.reduce((sum, i) => sum + (i.qty || 0), 0));
          return;
        } catch {
          // fallback to localStorage
        }
      }
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(stored.reduce((sum, i) => sum + (i.qty || 0), 0));
    }
    loadCount();
    window.addEventListener('storage', loadCount);
    return () => window.removeEventListener('storage', loadCount);
  }, [user]);

  // Auto-close collapse on link click (mobile)
  const handleNavItemClick = () => {
    const collapseEl = document.getElementById('navbarContent');
    if (collapseEl && collapseEl.classList.contains('show')) {
      collapseEl.classList.remove('show');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container d-flex align-items-center position-relative">
        {/* Toggler (visible on mobile/tablet) */}
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand: centered on mobile/tablet, left on desktop */}
        <Link to="/" className="navbar-brand">
          RAAH
        </Link>

        {/* Collapsible menu items: for desktop, appear inline; on mobile, dropdown */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleNavItemClick} >
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                href="#!"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
               
              >
                Shop
              </a>
              <ul className="dropdown-menu" >
                <li>
                  <Link to="/all-products" className="dropdown-item" onClick={handleNavItemClick}>
                    All
                  </Link>
                </li>
                <li>
                  <Link to="/all-products?gender=Men" className="dropdown-item" onClick={handleNavItemClick}>
                    Men
                  </Link>
                </li>
                <li>
                  <Link to="/all-products?gender=Women" className="dropdown-item" onClick={handleNavItemClick}>
                    Women
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                href="#!"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
                
              >
                Category
              </a>
              <ul className="dropdown-menu">
                {cats.map(cat => (
                  <li key={cat._id}>
                    <Link
                      to={`/all-products?category=${cat._id}`}
                      className="dropdown-item"
                      onClick={handleNavItemClick}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                href="#!"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
              
              >
                About
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/services" className="dropdown-item" onClick={handleNavItemClick}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="dropdown-item" onClick={handleNavItemClick}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="dropdown-item" onClick={handleNavItemClick}>
                    Contact
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* User + Cart icons: always on the right for all sizes */}
        <div className="nav-icons">
          <Link
            to={user ? `/profile/${user.id}` : '/login'}
            className="nav-icon-link"
            title={user ? `Hello, ${user.name}` : 'Login'}
            
          >
            <img src={userIcon} alt="User" />
          </Link>

          <Link to="/cart" className="nav-icon-link" >
            <img src={cartIcon} alt="Cart"  />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
