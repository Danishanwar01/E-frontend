import React from 'react';
import truckIcon from '../assets/images/truck.svg';
import bagIcon from '../assets/images/bag.svg';
import supportIcon from '../assets/images/support.svg';
import returnIcon from '../assets/images/return.svg';

const features = [
  { icon: truckIcon, title: 'Fast & Free Shipping' },
  { icon: bagIcon, title: 'Easy to Shop' },
  { icon: supportIcon, title: '24/7 Support' },
  { icon: returnIcon, title: 'Hassle Free Returns' },

];

const Services= () => {
  return (
    <>
      {/* Hero Section */}
   <h1 style={{textAlign:"center",marginTop:"1rem"}}>Services</h1>

      {/* Why Choose Us Section */}
      <div className="why-choose-section">
        <div className="container">
          <div className="row my-5">
            {features.map((feature, index) => (
              <div key={index} className="col-6 col-md-6 col-lg-3 mb-4">
                <div className="feature">
                  <div className="icon">
                    <img src={feature.icon} alt={feature.title} className="img-fluid" />
                  </div>
                  <h3 >{feature.title}</h3>
                  <p >
                    Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
