// src/pages/Shop.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/style.css"; 
import "../assets/css/tiny-slider.css";
import { fetchProducts } from "../api/products";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (e) {
        console.error(e);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ padding: "1rem" }}>Loading products…</p>;
  if (error)   return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Shop</h1>
        </div>
      </section>

      <div className="untree_co-section product-section before-footer-section">
        <div className="container">
          <div className="row">
            {products.map(prod => {
              // pick the first image URL or fallback
              const imgUrl = prod.images?.[0]
                ? `https://e-backend-rf04.onrender.com${prod.images[0]}`
                : require("../assets/images/product-1.png");

              // calculate final price after discount (optional)
              const finalPrice = prod.discount
                ? (prod.price * (100 - prod.discount) / 100).toFixed(2)
                : prod.price.toFixed(2);

              return (
                <div key={prod._id} className="col-12 col-md-4 col-lg-3 mb-5">
                  <div className="product-item">
                    <img
                      src={imgUrl}
                      className="img-fluid product-thumbnail"
                      alt={prod.title}
                    />
                    <h3 className="product-title">{prod.title}</h3>
                    {prod.discount > 0 ? (
                      <p>
                        <del className="text-muted">₹{prod.price}</del>{" "}
                        <strong className="product-price">₹{finalPrice}</strong>
                      </p>
                    ) : (
                      <strong className="product-price">₹{prod.price}</strong>
                    )}
                    <p className="small text-secondary">
                      Category: {prod.category.name} <br/>
                      Sub: {prod.subcategory.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
