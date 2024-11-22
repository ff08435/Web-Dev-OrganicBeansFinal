import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import beanIcon from '../../assets/bean.png';
import './Navbar.css';

const Navbar = ({ coffeeBeans }) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
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
    setSearchInput(option); // Update the search input with the selected option
    setFilteredOptions([]); // Clear the dropdown
    navigate(`/beans?search=${encodeURIComponent(option)}`); // Navigate to the query
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <ul className="navbar-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to="/beans">Beans</Link></li>
        </ul>
      </div>

      <div className="navbar-center">
        <img src={beanIcon} alt="Bean Icon" className="bean-icon" />
      </div>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/signup">Signup </Link></li> {/* Added Signup link */}
        </ul>
        <div className="navbar-icons">
          {/* Search Form with Dropdown */}
          <div className="search-form">
            <input
              type="text"
              placeholder="Search for coffee beans..."
              value={searchInput}
              onChange={handleSearchChange}
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
          <Link to="/checkout">
            <i className="fas fa-shopping-cart"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
