import React from 'react';
import jacketImg from '../assets/images/forhome.png';
import truck from '../assets/images/truck.svg';
import bag from '../assets/images/bag.svg';
import support from '../assets/images/support.svg';
import returns from '../assets/images/return.svg';
import whyChooseUsImg from '../assets/images/why-choose-us-img.jpg';
import person1 from '../assets/images/person_1.jpg';
import person2 from '../assets/images/person_2.jpg';
import person3 from '../assets/images/person_3.jpg';
import person4 from '../assets/images/person_4.jpg';
import personIcon from '../assets/images/person-1.png';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>About Us</h1>
                <p className="mb-4">
                  Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet
                  velit. Aliquam vulputate velit imperdiet dolor tempor tristique.
                </p>
                <p>
                  <a href="" className="btn btn-secondary me-2">
                    Shop Now
                  </a>
                  <a href="#" className="btn btn-white-outline">
                    Explore
                  </a>
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img-wrap">
                <img src={jacketImg} className="img-fluid" style={{height:'400' }} alt="jacket" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-choose-section">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title">Why Choose Us</h2>
              <p>
                Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet
                velit. Aliquam vulputate velit imperdiet dolor tempor tristique.
              </p>
              <div className="row my-5">
                {[{
                  img: truck,
                  title: "Fast & Free Shipping"
                }, {
                  img: bag,
                  title: "Easy to Shop"
                }, {
                  img: support,
                  title: "24/7 Support"
                }, {
                  img: returns,
                  title: "Hassle Free Returns"
                }].map((item, i) => (
                  <div className="col-6 col-md-6" key={i}>
                    <div className="feature">
                      <div className="icon">
                        <img src={item.img} alt="Icon" className="img-fluid" />
                      </div>
                      <h3>{item.title}</h3>
                      <p>
                        Donec vitae odio quis nisl dapibus malesuada. Nullam ac
                        aliquet velit. Aliquam vulputate.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="img-wrap">
                <img src={whyChooseUsImg} alt="Why Choose Us" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="untree_co-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-5 mx-auto text-center">
              <h2 className="section-title">Our Team</h2>
            </div>
          </div>
          <div className="row">
            {[person1, person2, person3, person4].map((img, idx) => (
              <div className="col-12 col-md-6 col-lg-3 mb-5 mb-md-0" key={idx}>
                <img src={img} className="img-fluid mb-5" alt={`Team member ${idx + 1}`} />
                <h3>
                  <a href="#"><span>{["Lawson", "Jeremy", "Patrik", "Kathryn"][idx]}</span> {["Arnold", "Walker", "White", "Ryan"][idx]}</a>
                </h3>
                <span className="d-block position mb-4">CEO, Founder, Atty.</span>
                <p>
                  Separated they live in Bookmarksgrove right at the coast of the
                  Semantics, a large language ocean.
                </p>
                <p className="mb-0">
                  <a href="#" className="more dark">
                    Learn More <span className="icon-arrow_forward" />
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
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
                    <span className="fa fa-chevron-left" />
                  </span>
                  <span className="next" data-controls="next">
                    <span className="fa fa-chevron-right" />
                  </span>
                </div>

                <div className="testimonial-slider">
                  {[1, 2, 3].map((_, i) => (
                    <div className="item" key={i}>
                      <div className="row justify-content-center">
                        <div className="col-lg-8 mx-auto">
                          <div className="testimonial-block text-center">
                            <blockquote className="mb-5">
                              <p>
                                &ldquo;Donec facilisis quam ut purus rutrum
                                lobortis. Donec vitae odio quis nisl dapibus
                                malesuada. Nullam ac aliquet velit. Aliquam
                                vulputate velit imperdiet dolor tempor tristique.
                                Pellentesque habitant morbi tristique senectus et
                                netus et malesuada fames ac turpis egestas. Integer
                                convallis volutpat dui quis scelerisque.&rdquo;
                              </p>
                            </blockquote>
                            <div className="author-info">
                              <div className="author-pic">
                                <img src={personIcon} alt="Maria Jones" className="img-fluid" />
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
    </div>
  );
};

export default About;
