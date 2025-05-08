import React from 'react';
import Slider from 'react-slick';
import person1 from '../assets/images/person-1.png';

// slick-carousel CSS (only import these once, e.g. in App.js or index.js)
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    quote: "Donec facilisis quam ut purus rutrum lobortis...",
    name: "Maria Jones",
    role: "CEO, Co-Founder, XYZ Inc.",
    image: person1,
  },
  // add more items here if needed
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

export default function TestimonialSlider() {
  return (
    <div className="testimonial-section">
      <div className="container text-center">
        <h2 className="section-title">Testimonials</h2>
        <Slider {...settings}>
          {testimonials.map((t, i) => (
            <div key={i}>
              <div className="testimonial-block text-center">
                <blockquote className="mb-5">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <div className="author-info">
                  <div className="author-pic">
                    <img src={t.image} alt={t.name} className="img-fluid" />
                  </div>
                  <h3 className="font-weight-bold">{t.name}</h3>
                  <span className="position d-block mb-3">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
