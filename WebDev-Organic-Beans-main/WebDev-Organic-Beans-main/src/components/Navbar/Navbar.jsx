import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ coffeeBeans }) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const [showSearch, setShowSearch] = useState(false); // State for showing search bar
  const navigate = useNavigate();

  // Handle search input changes
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    // Filter coffeeBeans based on user input
    if (input) {
      const matches = coffeeBeans.filter((bean) =>
        bean.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredOptions(matches);
    } else {
      setFilteredOptions([]);
    }
  };

  // Handle dropdown option selection
  const handleOptionSelect = (option) => {
    setSearchInput(option);
    setFilteredOptions([]);
    navigate(`/beans?search=${encodeURIComponent(option)}`);
  };

  // Handle hamburger menu toggle
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Handle search bar visibility toggle
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  return (
    <div className="navbar">
      {/* Navbar Left Section - Brand Name and Hamburger Button */}
      <div className="navbar-left">
        <div className="hamburger-menu">
          <button className="hamburger-btn" onClick={toggleMenu}>
            &#9776;
          </button>
        </div>
        <h1 className="brand-name">Organic Beans</h1>
      </div>

      {/* Navbar Right Section */}
      <div className="navbar-right">
        <ul className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
          <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link to="/quiz" onClick={() => setIsMenuOpen(false)}>Quiz</Link></li>
          <li><Link to="/beans" onClick={() => setIsMenuOpen(false)}>Beans</Link></li>
          <li><Link to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/signup" onClick={() => setIsMenuOpen(false)}>Signup</Link></li>
        </ul>
        <div className="navbar-icons">
          {/* Search Icon and Search Input */}
          <div className={`search-container ${showSearch ? 'active' : ''}`}>
            <i className="fas fa-search search-icon" onClick={toggleSearch}></i>
            {showSearch && (
              <div className="search-form">
                <input
                  type="text"
                  placeholder="Search for coffee beans..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {filteredOptions.length > 0 && (
                  <ul className="navbar-dropdown">
                    {filteredOptions.map((option, index) => (
                      <li
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="navbar-dropdown-item"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          {/* Cart Icon */}
          <Link to="/checkout">
            <i className="fas fa-shopping-cart cart-icon"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
