import React from "react";
import couchImg from "../assets/images/couch.png";
import post1 from "../assets/images/post-1.jpg";
import post2 from "../assets/images/post-2.jpg";
import post3 from "../assets/images/post-3.jpg";
import person1 from "../assets/images/person-1.png";


const Blog = () => {
    const blogPosts = [
      {
        title: "First Time Home Owner Ideas",
        author: "Kristin Watson",
        date: "Dec 19, 2021",
        image: post1,
      },
      {
        title: "How To Keep Your Furniture Clean",
        author: "Robert Fox",
        date: "Dec 15, 2021",
        image: post2,
      },
      {
        title: "Small Space Furniture Apartment Ideas",
        author: "Kristin Watson",
        date: "Dec 12, 2021",
        image: post3,
      },
    ];
  
    const testimonials = [1, 2, 3]; // Could be dynamic later
  
    return (
      <>
        {/* Hero Section */}

      <h1>Blog</h1>
        {/* Blog Section */}
        <div className="blog-section">
          <div className="container">
            <div className="row">
              {Array(3)
                .fill(blogPosts)
                .flat()
                .map((post, index) => (
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
                      <div className="post-content-entry">
                        <h3>
                          <a href="#">{post.title}</a>
                        </h3>
                        <div className="meta">
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
          </div>
        </div>
  
        {/* Testimonial Section */}
        <div className="testimonial-section before-footer-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 mx-auto text-center">
                <h2 className="section-title">Testimonials</h2>
              </div>
            </div>
  
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="testimonial-slider-wrap text-center">
                  <div id="testimonial-nav">
                    <span className="prev" data-controls="prev">
                      <span className="fa fa-chevron-left"></span>
                    </span>
                    <span className="next" data-controls="next">
                      <span className="fa fa-chevron-right"></span>
                    </span>
                  </div>
  
                  <div className="testimonial-slider">
                    {testimonials.map((_, index) => (
                      <div className="item" key={index}>
                        <div className="row justify-content-center">
                          <div className="col-lg-8 mx-auto">
                            <div className="testimonial-block text-center">
                              <blockquote className="mb-5">
                                <p>
                                  &ldquo;Donec facilisis quam ut purus rutrum
                                  lobortis. Donec vitae odio quis nisl dapibus
                                  malesuada. Nullam ac aliquet velit. Aliquam
                                  vulputate velit imperdiet dolor tempor
                                  tristique. Pellentesque habitant morbi tristique
                                  senectus et netus et malesuada fames ac turpis
                                  egestas. Integer convallis volutpat dui quis
                                  scelerisque.&rdquo;
                                </p>
                              </blockquote>
                              <div className="author-info">
                                <div className="author-pic">
                                  <img
                                    src={person1}
                                    alt="Maria Jones"
                                    className="img-fluid"
                                  />
                                </div>
                                <h3 className="font-weight-bold">Maria Jones</h3>
                                <span className="position d-block mb-3">
                                  CEO, Co-Founder, XYZ Inc.
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
  