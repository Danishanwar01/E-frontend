import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Auth.css";

export default function Profile() {
  const { id } = useParams();
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
    avatarUrl: "",
  });
  const [message, setMessage] = useState("");

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/userdata/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
          phone: data.phone || "",
          avatarUrl: data.avatarUrl || "",
        }));
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.orders || [];
        // Ensure every item has reviewSubmitted flag
        const normalized = arr.map((order) => {
          if (Array.isArray(order.items)) {
            const itemsWithFlag = order.items.map((item) => ({
              ...item,
              reviewSubmitted: item.reviewSubmitted || false,
            }));
            return { ...order, items: itemsWithFlag };
          }
          return order;
        });
        setOrders(normalized);
      })
      .catch((err) => console.error("Fetch orders error:", err));
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, avatarUrl: localUrl }));
    // अगर आप सर्वर पर अपलोड करना चाहते हैं, तो वहाँ भी logic डालें
  };

  const handleFilterClick = (status) => {
    setFilterStatus(status);
    setExpandedOrder(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p className="loading-text">Loading profile…</p>;
  }

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "All") return true;
    return order.status === filterStatus;
  });

  return (
    <div className="profile-container">
      {/* ------------------------------------------------------------
         LEFT: Profile Section
         ------------------------------------------------------------ */}
      <section className="profile-section">
        <div className="dashboard-card">
          {/* User Header (Avatar + Greeting + Logout) */}
          <div className="user-header">
            <div className="avatar-wrapper">
              <div className="user-avatar">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Avatar"
                    className="avatar-image"
                  />
                ) : (
                  // user?.name से पहले चेक कर रहे हैं कि name मौजूद है या नहीं
                  <span className="avatar-placeholder">
                    {user.name ? user.name.charAt(0).toUpperCase() : ""}
                  </span>
                )}
              </div>
              <button
                className="edit-avatar-btn"
                onClick={() =>
                  document.getElementById("avatar-input").click()
                }
              >
                ✎
              </button>
              <input
                type="file"
                id="avatar-input"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="greeting-logout-wrapper">
              {/* यहाँ भी user.name.split से पहले चेक कर लीजिए */}
              <h2 className="user-greeting">
                Welcome Back, {user.name ? user.name.split(" ")[0] : "User"}!
              </h2>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------
             Account Settings Accordion
             ------------------------------------------------------------ */}
          <div className="accordion">
            <div className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => setShowProfile(!showProfile)}
              >
                <span>🛠 Account Settings</span>
                <span
                  className={`accordion-icon ${showProfile ? "open" : ""}`}
                >
                  ▼
                </span>
              </button>
              {showProfile && (
                <div className="accordion-content">
                  <form className="profile-form" onSubmit={handleUpdate}>
                    <div className="form-grid">
                      {/* Full Name */}
                      <div className="form-group">
                        <label className="input-label">
                          <span className="label-icon">👤</span>
                          Full Name
                        </label>
                        <input
                          className="modern-input"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Address */}
                      <div className="form-group">
                        <label className="input-label">
                          <span className="label-icon">🏠</span>
                          Address
                        </label>
                        <input
                          className="modern-input"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="Enter your address"
                        />
                      </div>

                      {/* City */}
                      <div className="form-group">
                        <label className="input-label">
                          <span className="label-icon">🌆</span>
                          City
                        </label>
                        <input
                          className="modern-input"
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="Enter your city"
                        />
                      </div>

                      {/* Country */}
                      <div className="form-group">
                        <label className="input-label">
                          <span className="label-icon">🌍</span>
                          Country
                        </label>
                        <input
                          className="modern-input"
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          placeholder="Enter your country"
                        />
                      </div>

                      {/* Postal Code */}
                      <div className="form-group">
                        <label className="input-label">
                          <span className="label-icon">📮</span>
                          Postal Code
                        </label>
                        <input
                          className="modern-input"
                          name="postalCode"
                          value={form.postalCode}
                          onChange={handleChange}
                          placeholder="Enter postal code"
                        />
                      </div>

                      {/* Phone */}
                      <div className="form-group">
                        <label className="input-label">
                          <span className="label-icon">📞</span>
                          Phone
                        </label>
                        <input
                          className="modern-input"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                        />
                      </div>

                      {/* New Password (Full Width) */}
                      <div className="form-group full-width">
                        <label className="input-label">
                          <span className="label-icon">🔒</span>
                          New Password
                        </label>
                        <input
                          className="modern-input"
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button className="gradient-btn update-btn" type="submit">
                      💾 Update Profile
                    </button>
                    {message && <p className="form-message">{message}</p>}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
         RIGHT: Orders Section
         ------------------------------------------------------------ */}
      <section className="orders-section">
        <div className="dashboard-card">
          <div className="orders-header">
            <h2>📦 Order History</h2>
            <div className="status-filter">
              {["All", "Processing", "Shipped", "Delivered"].map((status) => (
                <button
                  key={status}
                  className={`filter-btn ${
                    filterStatus === status ? "active" : ""
                  }`}
                  onClick={() => handleFilterClick(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order, idx) => (
                <div
                  className={`order-card ${
                    order.status.toLowerCase() || "processing"
                  }`}
                  key={order._id || idx}
                >
                  {/* Order Header */}
                  <div className="order-header">
                    <div className="order-meta">
                      <span className="order-number">ORDER #{idx + 1}</span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className={`status-badge ${
                        order.status.toLowerCase()
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>

                  {/* Order Body (Thumbnail + Summary) */}
                  <div className="order-body">
                    <div className="product-preview">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div className="product-thumb" key={i}>
                          {item.productId?.image ? (
                            <img
                              src={item.productId.image}
                              alt={item.productId.title}
                              className="thumb-image"
                            />
                          ) : (
                            <div className="image-placeholder">🖼</div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="order-summary">
                      <div className="summary-item">
                        <span>Items</span>
                        <span>{order.items.length}</span>
                      </div>
                      <div className="summary-item">
                        <span>Product</span>
                        <span>
                          {order.items[0]?.productId?.title
                            ? order.items[0].productId.title
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer (Details Toggle + Review Button) */}
                  <div className="order-footer">
                    <button
                      className="detail-btn"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order._id ? null : order._id
                        )
                      }
                    >
                      {expandedOrder === order._id
                        ? "▲ Collapse"
                        : "▼ Details"}
                    </button>

                    {order.status === "Delivered" && (
                      <button className="review-btn">⭐ Leave Review</button>
                    )}
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <div className="order-details">
                      {Array.isArray(order.items) &&
                      order.items.length > 0 ? (
                        <ul className="item-list-expanded">
                          {order.items.map((it, j) => {
                            const product = it.productId;
                            const title =
                              product?.title || "(Unknown Product)";
                            const alreadyReviewed = Boolean(
                              it.reviewSubmitted
                            );

                            return (
                              <li className="item-row-expanded" key={j}>
                                <div className="item-main-expanded">
                                  <span className="item-name-expanded">
                                    {title}
                                  </span>
                                  <span className="item-details-expanded">
                                    ×{it.qty}
                                    {it.size && `, Size: ${it.size}`}
                                    {it.color && `, Color: ${it.color}`}
                                  </span>
                                </div>

                                {order.status === "Delivered" &&
                                  !alreadyReviewed && (
                                    <ReviewForm
                                      userId={id}
                                      productId={product?._id}
                                      orderItemIndex={j}
                                      orderId={order._id}
                                      onReviewSubmitted={() => {
                                        setOrders((prevOrders) =>
                                          prevOrders.map((o) => {
                                            if (o._id !== order._id) return o;
                                            const newItems = o.items.map(
                                              (item, k) => {
                                                if (k !== j) return item;
                                                return {
                                                  ...item,
                                                  reviewSubmitted: true,
                                                };
                                              }
                                            );
                                            return { ...o, items: newItems };
                                          })
                                        );
                                      }}
                                    />
                                  )}

                                {order.status === "Delivered" &&
                                  alreadyReviewed && (
                                    <p className="review-thankyou-expanded">
                                      Thanks for your review!
                                    </p>
                                  )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="no-items-expanded">
                          No items in this order.
                        </p>
                      )}

                      {Array.isArray(order.tracking) &&
                        order.tracking.length > 0 && (
                          <TrackingTimeline events={order.tracking} />
                        )}

                      <p className="detail-text-expanded">
                        <strong>Order ID:</strong> {order._id} <br />
                        <strong>Courier:</strong> {order.courierPartner || "—"}{" "}
                        <br />
                        <strong>Tracking #:</strong>{" "}
                        {order.trackingNumber || "—"} <br />
                        {order.shipping && (
                          <>
                            <strong>Ship To:</strong> {order.shipping.address},{" "}
                            {order.shipping.city}, {order.shipping.country} (PIN{" "}
                            {order.shipping.postalCode}) <br />
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ------------------------------------------------------
// ReviewForm Component
// ------------------------------------------------------
function ReviewForm({
  userId,
  productId,
  orderId,
  orderItemIndex,
  onReviewSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            rating,
            comment,
            orderId,
            orderItemIndex,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to submit review.");
      await res.json();
      onReviewSubmitted();
    } catch (err) {
      console.error(err);
      setError("Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form-expanded" onSubmit={handleSubmitReview}>
      <div className="review-group-expanded">
        <label className="review-label">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={submitting}
          className="review-select-expanded"
        >
          <option value={5}>★★★★★</option>
          <option value={4}>★★★★☆</option>
          <option value={3}>★★★☆☆</option>
          <option value={2}>★★☆☆☆</option>
          <option value={1}>★☆☆☆☆</option>
        </select>
      </div>

      <div className="review-group-expanded">
        <label className="review-label">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review…"
          rows={3}
          disabled={submitting}
          className="review-textarea-expanded"
        />
      </div>

      {error && <p className="review-error-expanded">{error}</p>}

      <button
        type="submit"
        className="btn-submit-review-expanded"
        disabled={submitting}
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

// ------------------------------------------------------
// TrackingTimeline Component
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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[d.getMonth()];

    const yearShort = String(d.getFullYear()).slice(-2);

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes}${ampm}`;

    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    return `${weekday}, ${dayWithSuffix} ${month} ’${yearShort} – ${timeString}`;
  };

  return (
    <div className="timeline-expanded">
      {events.map((ev, i) => (
        <div className="timeline-item-expanded" key={i}>
          <span className="timeline-dot-expanded" />
          <div className="timeline-content-expanded">
            <h4 className="timeline-status-expanded">{ev.status}</h4>
            <p className="timeline-message-expanded">
              {ev.message || "No message available"}
            </p>
            <p className="timeline-timestamp-expanded">
              {formatTimestamp(ev.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
