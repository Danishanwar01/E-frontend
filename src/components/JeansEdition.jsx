import React from 'react';
import { Link } from 'react-router-dom';
import tshirtImage from '../assets/images/bjeans.jpg';
import '../styles/JacketEdition.css';

const JeansEdition = () => (
  <div className="te-root">
    <div className="te-content">
    
      <div className="te-text-block">
        <div className="te-title-wrapper">
          <h1 className="te-title">
            <span className="te-title-main">JEANS</span>
            <span className="te-title-sub">COLLECTION 2025</span>
          </h1>
          <div className="te-title-decoration" />
        </div>

        <div className="te-divider-block">
          <div className="te-divider-line" />
          <p className="te-subtext">Crafting Timeless Outerwear</p>
          <div className="te-divider-line" />
        </div>

        <div className="te-buttons">
          <Link to="/all-products" className="te-btn">
            <span className="te-btn-text">Explore Mens</span>
            <div className="te-btn-hover" />
          </Link>
          <Link to="/all-products" className="te-btn">
            <span className="te-btn-text">Discover Womens</span>
            <div className="te-btn-hover" />
          </Link>
        </div>
      </div>

   
      <div className="te-image-block">
        <div className="te-image-frame">
          <img
            src={tshirtImage}
            alt="Premium T-Shirt Collection"
            className="te-image"
          />
        </div>
        <div className="te-image-pattern" />
      </div>
    </div>
  </div>
);

export default JeansEdition;
