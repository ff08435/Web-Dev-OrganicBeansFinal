import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Simple Introduction Section */}
      <section className="introduction-section">
        <h1>Welcome to Organic Beans</h1>
        <p>
          We are passionate about bringing you the best organically sourced coffee beans. 
          Explore our collection to find your perfect blend and join our mission to enjoy great coffee responsibly.
        </p>
        <Link to="/Beans">
          <button className="shop-now-button">Shop Now</button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
