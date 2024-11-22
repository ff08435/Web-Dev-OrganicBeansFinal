// src/pages/About.js
import './About.css';
import coffeeAbout from '../pages/colombian-decaf.png';  

import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <h1>About Organic Beans</h1>
      <p>
        Our story began with the simple idea of providing the highest quality organically sourced
        coffee beans. From humble beginnings, we’ve grown to deliver premium beans to coffee lovers
        worldwide. Learn more about our values, our process, and how we’re committed to sustainable
        and ethical sourcing.
      </p>
      
      <div className="navbar-center">
        <img src={coffeeAbout} alt="coffee About" className="coffee-about" />
      </div>
    </div>

    
  );
};

export default About;
