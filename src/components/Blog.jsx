import React from "react";
import heroImg from "../assets/images/bcargo.jpg";
import post1 from "../assets/images/bjacket.png";
import post2 from "../assets/images/bjeans.jpg";
import post3 from "../assets/images/bshirt.jpg";
import person1 from "../assets/images/btshirt.jpg";

const Blog = () => {
  const blogPosts = [
    {
      title: "Top Spring 2025 Fashion Trends",
      author: "Ava Williams",
      date: "Mar 05, 2025",
      image: post1,
      excerpt: "Discover the must-have pieces shaping this spring's wardrobe, from pastel blazers to eco-friendly fabrics.",
      category: "Trends",
    },
    {
      title: "How to Style a Denim Jacket",
      author: "Liam Johnson",
      date: "Feb 20, 2025",
      image: post2,
      excerpt: "Learn versatile ways to elevate your denim jacket for any occasion, whether casual or chic.",
      category: "Styling Tips",
    },
    {
      title: "Top 10 Winter Coats for Men & Women",
      author: "Emma Brown",
      date: "Jan 15, 2025",
      image: post3,
      excerpt: "Keep warm and stylish this winter with our curated list of the best coats for every budget.",
      category: "Guides",
    },
  ];

  const testimonials = [
    {
      quote: `“I absolutely love the quality of the winter coat I purchased! It’s warm, stylish, and received so many compliments. Will definitely shop again.”`,
      name: "Sophia Martinez",
      position: "Fashion Blogger",
      image: person1,
    },
    {
      quote: `“Their styling guide on denim jackets helped me refresh my entire look. The tips were easy to follow and the products are top-notch.”`,
      name: "Ethan Davis",
      position: "Stylist, Urban Threads",
      image: person1,
    },
    {
      quote: `“The customer service was excellent and the spring collection items exceeded my expectations. My go-to store for all seasons!”`,
      name: "Olivia Lee",
      position: "Content Creator",
      image: person1,
    },
  ];

  return (
    <>
      {/* Hero Section with Background Image */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
         marginTop:"1rem",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", textShadow: "2px 2px 4px rgba(255, 255, 255, 0.81)",color:"dark-grey" }}>Fashion Blog</h1>
        <p style={{ fontSize: "1.2rem", marginTop: "1rem" ,color:"white"}}>
          Stay ahead with the latest style tips, trend reports, and fashion inspiration.
        </p>
      </div>

      {/* Blog Section */}
      <div className="blog-section py-5">
        <div className="container">
          <div className="row">
            {blogPosts.map((post, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 mb-5"
                key={`${post.title}-${index}`}
              >
                <div className="post-entry">
                  <a href="#" className="post-thumbnail">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="img-fluid"
                    />
                  </a>
                  <div className="post-content-entry mt-3">
                    <span className="badge bg-secondary mb-2">
                      {post.category}
                    </span>
                    <h3 className="h5 mb-2">
                      <a href="#" className="text-dark">
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-muted mb-2">{post.excerpt}</p>
                    <div className="meta text-muted">
                      <span>
                        by <a href="#">{post.author}</a>
                      </span>{" "}
                      <span>
                        on <a href="#">{post.date}</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-Page CTA Banner */}
          <div
            className="cta-banner my-5 text-center p-4"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "0.5rem",
            
            }}
          >
            <h2 className="mb-3">Love These Styles?</h2>
            <p className="mb-4">
              Explore our latest fashion collection and revamp your wardrobe.
            </p>
            <a href="/all-products" className="btn btn-primary px-4 py-2" style={{background:"grey" }}>
              Shop Collection
            </a>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="testimonial-section before-footer-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto text-center">
              <h2 className="section-title mb-4">Testimonials</h2>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="testimonial-slider-wrap text-center">
                <div id="testimonial-nav" className="mb-3">
                  <span className="prev" data-controls="prev">
                    <span className="fa fa-chevron-left"></span>
                  </span>
                  <span className="next" data-controls="next">
                    <span className="fa fa-chevron-right"></span>
                  </span>
                </div>

                <div className="testimonial-slider">
                  {testimonials.map((item, index) => (
                    <div className="item" key={index}>
                      <div className="row justify-content-center">
                        <div className="col-lg-8 mx-auto">
                          <div className="testimonial-block text-center px-4">
                            <blockquote className="mb-5">
                              <p>{item.quote}</p>
                            </blockquote>
                            <div className="author-info">
                              <div className="author-pic mb-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="img-fluid rounded-circle"
                                  style={{ width: "80px", height: "80px" }}
                                />
                              </div>
                              <h3 className="font-weight-bold mb-1">{item.name}</h3>
                              <span className="position d-block text-muted">
                                {item.position}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
