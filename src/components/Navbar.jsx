import React, { useState, useEffect } from 'react';
import { Link }                        from 'react-router-dom';
import { fetchCategories }             from '../api/categories';
import userIcon                        from "../assets/images/user.svg";
import cartIcon                        from "../assets/images/cart.svg";
import searchIcon                      from "../assets/images/search.svg";

const styles = {
  customNavbar: {
    position: 'relative',
    zIndex: 2000,
    padding: '1rem 0',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    overflow: 'visible',
  },
  brandText: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#2a2a2a',
    letterSpacing: '-0.5px',
    textDecoration: 'none',
  },
  navLink: {
    color: '#444',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 2001,
    border: 'none',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    marginTop: '0.5rem',
    background: '#fff',
    minWidth: '12rem',
  },
  dropdownItem: {
    padding: '0.75rem 1.5rem',
    color: '#555',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'block',
  },
  iconLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.25rem',
    position: 'relative',
    textDecoration: 'none',
  },
  navIcon: {
    width: '22px',
    height: '22px',
    transition: 'transform 0.2s ease',
    filter: 'brightness(0) saturate(100%)',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#2a2a2a',
    color: 'white',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    fontSize: '0.65rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbarToggler: {
    border: 'none',
    padding: '0.5rem',
  },
};

export default function Navbar() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(res => setCats(res.data))
      .catch(console.error);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg" style={styles.customNavbar}>
      <div className="container">
        <Link to="/" style={styles.brandText}>Raah</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          style={styles.navbarToggler}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link to="/" style={styles.navLink}>Home</Link>
            </li>

            {/* Shop (Gender) */}
            <li className="nav-item dropdown">
              <a
                href="#!"
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                style={styles.navLink}
              >
                Shop
              </a>
              <ul className="dropdown-menu" style={styles.dropdownMenu}>
                <li>
                  <Link to="/all-products" style={styles.dropdownItem}>All</Link>
                </li>
                <li>
                  <Link to="/all-products?gender=Men" style={styles.dropdownItem}>
                    Men
                  </Link>
                </li>
                <li>
                  <Link to="/all-products?gender=Women" style={styles.dropdownItem}>
                    Women
                  </Link>
                </li>
              </ul>
            </li>

            {/* Category */}
            <li className="nav-item dropdown">
              <a
                href="#!"
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                style={styles.navLink}
              >
                Category
              </a>
              <ul className="dropdown-menu" style={styles.dropdownMenu}>
                {cats.map(cat => (
                  <li key={cat._id}>
                    <Link
                      to={`/all-products?category=${cat._id}`}
                      style={styles.dropdownItem}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* About */}
            <li className="nav-item dropdown">
              <a
                href="#!"
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                style={styles.navLink}
              >
                About
              </a>
              <ul className="dropdown-menu" style={styles.dropdownMenu}>
                <li>
                  <Link to="/services" style={styles.dropdownItem}>Services</Link>
                </li>
                <li>
                  <Link to="/blog" style={styles.dropdownItem}>Blog</Link>
                </li>
                <li>
                  <Link to="/contact" style={styles.dropdownItem}>Contact</Link>
                </li>
              </ul>
            </li>

            {/* Icons */}
            <li className="d-flex align-items-center ms-lg-4">
              <Link to="/search" style={styles.iconLink}>
                <img src={searchIcon} alt="Search" style={styles.navIcon} />
              </Link>
              <Link to="/profile" className="ms-3" style={styles.iconLink}>
                <img src={userIcon} alt="User" style={styles.navIcon} />
              </Link>
              <Link to="/cart" className="ms-3 position-relative" style={styles.iconLink}>
                <img src={cartIcon} alt="Cart" style={styles.navIcon} />
                <span style={styles.cartBadge}>3</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
