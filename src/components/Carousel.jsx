import React from 'react';
import { Link } from 'react-router-dom';
import person1Image from '../assets/images/srk.jpg';
import '../styles/Carousel.css';

const Carousel = () => {
  return (
    <div className="luxury-carousel">
      <div className="carousel-content">
        <div className="text-wrapper">
          <h1 className="collection-title">
            <span>COLLECTION</span>
            <span className="year">2025</span>
          </h1>
          
          <div className="subtitle-wrapper">
            <div className="deco-line"></div>
            <p className="essentials-text">
              Discover premium fashion essentials
            </p>
            <div className="deco-line"></div>
          </div>

          <div className="btn-container">
            <Link 
              to="/all-products" 
              className="shop-btn men-btn"
            >
              SHOP MEN
              <span className="hover-bar"></span>
            </Link>
            <Link 
              to="/all-products" 
              className="shop-btn women-btn"
            >
              SHOP WOMEN
              <span className="hover-bar"></span>
            </Link>
          </div>
        </div>
        
        <img 
          src={person1Image} 
          alt="Luxury Collection" 
          className="hero-image"
        />
      </div>
    </div>
  );
};

export default Carousel; 