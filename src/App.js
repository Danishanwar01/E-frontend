import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Shop from './components/Shop';
import About from './components/About';
import Services from './components/Services';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Cart from './components/Cart';
import User from './components/User';
import Footer from './components/Footer';
import AllProductsPage from './components/AllProducts';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import Profile from './components/Profile';




const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      
         <Route path="/shop" element={<Shop />} />
         <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<User/>} />
        <Route path="/cart" element={<Cart />} />  
        <Route path="/all-products" element={<AllProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path= "/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
       <Route path="/profile/:id" element={<Profile />} />



      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
