// src/pages/Profile.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Auth.css"; 

export default function Profile() {
  const { id } = useParams();         // userId from route
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    password: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);

  // Dropdown state
  const [showProfile, setShowProfile] = useState(true);
  const [showOrders, setShowOrders] = useState(true);

  // 1) Load profile info
  useEffect(() => {
    fetch(`http://localhost:5000/api/userdata/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || "",
          password: "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
          phone: data.phone || "",
        });
      })
      .catch(console.error);
  }, [id]);

  // 2) Load orders (user-specific)
  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.orders || [];
        setOrders(arr);
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updates = { ...form };
    if (!updates.password) delete updates.password;

    fetch(`http://localhost:5000/api/userdata/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setMessage("Profile updated successfully!");
        setForm((prev) => ({ ...prev, password: "" }));
      })
      .catch((err) => {
        console.error(err);
        setMessage("Update failed");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p className="loading-text">Loading profile…</p>;
  }

  return (
    <div className="profile-container">
      {/* ------------------------------------------------------------
          LEFT: Profile dropdown
         ------------------------------------------------------------ */}
      <section className="profile-section">
        <div className="dropdown-panel">
          <button
            className="dropdown-header"
            onClick={() => setShowProfile((prev) => !prev)}
          >
            <span>My Profile</span>
            <span className={`arrow ${showProfile ? "open" : ""}`} />
          </button>
          {showProfile && (
            <div className="dropdown-content">
              <div className="profile-card">
                <form className="profile-form" onSubmit={handleUpdate}>
                  {/* Full Name */}
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      className="input"
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div className="form-group">
                    <label htmlFor="email">Email (read-only)</label>
                    <input
                      className="input"
                      id="email"
                      type="email"
                      value={user.email}
                      readOnly
                    />
                  </div>

                  {/* Address */}
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      className="input"
                      id="address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>

                  {/* City */}
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      className="input"
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Country */}
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      className="input"
                      id="country"
                      name="country"
                      type="text"
                      value={form.country}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      className="input"
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={form.postalCode}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      className="input"
                      id="phone"
                      name="phone"
                      type="text"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* New Password */}
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      className="input"
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="(Leave blank to keep old)"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                  {message && <p className="form-message">{message}</p>}
                </form>

                <button className="btn btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------
          RIGHT: Orders dropdown (with scrollable order cards)
         ------------------------------------------------------------ */}
      <section className="orders-section">
        <div className="dropdown-panel">
          <button
            className="dropdown-header"
            onClick={() => setShowOrders((prev) => !prev)}
          >
            <span>My Orders</span>
            <span className={`arrow ${showOrders ? "open" : ""}`} />
          </button>
          {showOrders && (
            <div className="dropdown-content">
              <div className="orders-card">
                {orders.length === 0 ? (
                  <p className="no-orders">No past orders.</p>
                ) : (
                  orders.map((order, idx) => {
                    // Each order
                    const itemsArray = Array.isArray(order.items) ? order.items : [];
                    return (
                      <div className="order-card" key={order._id || idx}>
                        {/* Header: Order # and Amount */}
                        <div className="order-header">
                          <h3>Order #{idx + 1}</h3>
                          <span className="order-amount">
                            ₹{order.totalAmount.toFixed(2)}
                          </span>
                        </div>

                        {/* Meta: ID, date, status, courier, tracking # */}
                        <p className="order-meta">
                          <strong>Order ID:</strong> {order._id} <br />
                          <strong>Placed:</strong>{" "}
                          {new Date(order.createdAt).toLocaleString()} <br />
                          {order.status && (
                            <>
                              <strong>Status:</strong> {order.status} <br />
                            </>
                          )}
                          <strong>Courier:</strong> {order.courierPartner || "—"} <br />
                          <strong>Tracking #:</strong> {order.trackingNumber || "—"} <br />
                        </p>

                        {/* Shipping Info */}
                        {order.shipping && (
                          <div className="order-shipping">
                            <strong>Ship To:</strong> {order.shipping.address}, {order.shipping.city}, {order.shipping.country} (PIN {order.shipping.postalCode})
                          </div>
                        )}

                        {/* Items list */}
                        {itemsArray.length === 0 ? (
                          <p className="no-items">No items in this order.</p>
                        ) : (
                          <ul className="item-list">
                            {itemsArray.map((it, j) => {
                              const product = it.productId; // populated in backend
                              const title = product?.title || "(Unknown Product)";
                              const alreadyReviewed = Boolean(it.reviewSubmitted); 
                              // `it.reviewSubmitted` is a flag you should set on backend 
                              // once the user submits a review for this item.

                              return (
                                <li className="item-row" key={j}>
                                  <div className="item-main">
                                    <span className="item-name">{title}</span>
                                    <span className="item-details">
                                      ×{it.qty}
                                      {it.size && `, Size: ${it.size}`}
                                      {it.color && `, Color: ${it.color}`}
                                    </span>
                                  </div>

                                  {/* If order is delivered AND this item isn't reviewed yet, show ReviewForm */}
                                  {order.status === "Delivered" && !alreadyReviewed && (
                                    <ReviewForm 
                                      userId={id}
                                      productId={product?._id}
                                      orderItemIndex={j}
                                      orderId={order._id}
                                      onReviewSubmitted={() => {
                                        // Mark locally that this item is reviewed
                                        setOrders(prevOrders =>
                                          prevOrders.map(o => {
                                            if (o._id !== order._id) return o;
                                            const newItems = o.items.map((item, k) => {
                                              if (k !== j) return item;
                                              return { ...item, reviewSubmitted: true };
                                            });
                                            return { ...o, items: newItems };
                                          })
                                        );
                                      }}
                                    />
                                  )}

                                  {/* If already reviewed, show a "Thanks for your review!" note */}
                                  {order.status === "Delivered" && alreadyReviewed && (
                                    <p className="review-thankyou">Thanks for your review!</p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}

                        {/* Tracking Timeline */}
                        {Array.isArray(order.tracking) &&
                          order.tracking.length > 0 && (
                            <TrackingTimeline events={order.tracking} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


// ------------------------------------------------------
// ReviewForm component (embedded in Profile.js)
// ------------------------------------------------------
function ReviewForm({ userId, productId, orderId, orderItemIndex, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, rating, comment, orderId, orderItemIndex })
      });
      if (!res.ok) throw new Error("Failed to submit review.");
      await res.json(); // assume returns the new review
      onReviewSubmitted();
    } catch (err) {
      console.error(err);
      setError("Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmitReview}>
      <div className="review-group">
        <label>Rating:</label>
        <select 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={submitting}
        >
          <option value={5}>★★★★★</option>
          <option value={4}>★★★★☆</option>
          <option value={3}>★★★☆☆</option>
          <option value={2}>★★☆☆☆</option>
          <option value={1}>★☆☆☆☆</option>
        </select>
      </div>

      <div className="review-group">
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review…"
          rows={3}
          disabled={submitting}
        />
      </div>

      {error && <p className="review-error">{error}</p>}

      <button type="submit" className="btn btn-submit-review" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}



// ------------------------------------------------------
// TrackingTimeline (same as before)
// ------------------------------------------------------
function TrackingTimeline({ events }) {
  const formatTimestamp = (isoString) => {
    const d = new Date(isoString);

    const day = d.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    const dayWithSuffix = `${day}${suffix}`;

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = monthNames[d.getMonth()];

    const yearShort = String(d.getFullYear()).slice(-2);

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes}${ampm}`;

    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    return `${weekday}, ${dayWithSuffix} ${month} ’${yearShort} – ${timeString}`;
  };

  return (
    <div className="timeline">
      {events.map((ev, i) => (
        <div className="timeline-item" key={i}>
          <span className="timeline-dot" />
          <div className="timeline-content">
            <h4 className="timeline-status">{ev.status}</h4>
            <p className="timeline-message">
              {ev.message || "No message available"}
            </p>
            <p className="timeline-timestamp">
              {formatTimestamp(ev.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
