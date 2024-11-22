import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Slideshow from './components/Slideshow/Slideshow';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AboutBox from './components/AboutBox/AboutBox';
import About from './pages/About';
import Signup from './pages/signup';
import Contact from './pages/contact';
import Beans from './pages/Beans';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Quiz from './pages/Quiz';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Coffee beans array to pass to Navbar and Beans
  const coffeeBeans = [
    "Organic Ethiopian Beans",
    "Guatemalan Dark Roast",
    "Colombian Decaf",
    "Organic Sumatran Beans",
  ];

  const validateToken = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (response.ok) {
        toast.success("Authentication successful!", { autoClose: 2000 });
        return true; // Token is valid
      } else {
        toast.error("Session expired. Please log in again.", { autoClose: 2000 });
        return false; // Token is invalid
      }
    } catch (error) {
      console.error("Error validating token:", error);
      toast.error("Error validating token. Please try again.", { autoClose: 2000 });
      return false;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token"); // Clear invalid token
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false); // No token, user is unauthenticated
      }
    };

    checkAuthentication();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast.success("Login successful!", { autoClose: 2000 });
  };

  return (
    <Router>
      <div className="app">
        <ToastContainer /> {/* Add ToastContainer here */}
        <Navbar coffeeBeans={coffeeBeans} isAuthenticated={isAuthenticated} />
        <Routes>
          {!isAuthenticated ? (
            // Unauthenticated routes
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            // Authenticated routes
            <>
              <Route
                path="/"
                element={
                  <div className="content">
                    <Slideshow />
                    <AboutBox />
                  </div>
                }
              />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/beans" element={<Beans coffeeBeans={coffeeBeans} />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
