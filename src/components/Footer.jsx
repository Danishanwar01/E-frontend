import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Footer.css";

export default function SocialComponent() {
  return (
    
     <>
     
      {/* Footer */}
      <footer className="footer  border-top py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className="fw-bold mb-3">Raah</h5>
              <p className="text-muted small">Premium Fashion Destination</p>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-4">
                  <h6 className="small fw-bold">Shop</h6>
                  <ul className="list-unstyled">
                  <li><a href="/all-products" className="text-dark small">All</a></li>
                    <li><a href="/all-products?gender=Men" className="text-dark small">Men</a></li>
                    <li><a href="/all-products?gender=Women" className="text-dark small">Women</a></li>
                    
                  </ul>
                </div>
                <div className="col-4">
                  <h6 className="small fw-bold">Support</h6>
                  <ul className="list-unstyled">
                    <li><a href="/contact" className="text-dark small">Contact</a></li>
                    <li><a href="/services" className="text-dark small">Services</a></li>
                    <li><a href="/blog" className="text-dark small">Blog</a></li>
                  </ul>
                </div>
                <div className="col-4">
                  <h6 className="small fw-bold">Legal</h6>
                  <ul className="list-unstyled">
                    <li><a href="#" className="text-dark small">Privacy</a></li>
                    <li><a href="#" className="text-dark small">Terms</a></li>
                    <li><a href="#" className="text-dark small">Security</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="small text-muted">
              © {new Date().getFullYear()} Raah. All rights reserved
            </p>
          </div>
        </div>
      </footer>
 
     </>
 
  );
}