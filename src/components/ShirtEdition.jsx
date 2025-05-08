import React from 'react';
import { Link } from 'react-router-dom';
import tshirtImage from '../assets/images/shirt.jpg';
import '../styles/JacketEdition.css';

const ShirtEdition = () => (
  <div className="je-root">
    <div className="je-content">
      <div className="je-text-block">
        <div className="je-title-wrapper">
          <h1 className="je-title">
            <span className="je-title-main">SHIRT</span>
            <span className="je-title-sub">COLLECTION 2025</span>
          </h1>
          <div className="je-title-decoration"></div>
        </div>

        <div className="je-divider-block">
          <div className="je-divider-line"></div>
          <p className="je-subtext">Crafting Timeless Outerwear</p>
          <div className="je-divider-line"></div>
        </div>

        <div className="je-buttons">
          <Link to="/shop/mens-shirts" className="je-btn">
            <span className="je-btn-text">Explore Mens</span>
            <div className="je-btn-hover"></div>
          </Link>
          <Link to="/shop/womens-shirts" className="je-btn">
            <span className="je-btn-text">Discover Womens</span>
            <div className="je-btn-hover"></div>
          </Link>
        </div>
      </div>

      <div className="je-image-block">
        <div className="je-image-frame">
          <img src={tshirtImage} alt="Premium tshirt Collection" className="je-image" />
        </div>
        <div className="je-image-pattern"></div>
      </div>
    </div>
  </div>
);

export default ShirtEdition;