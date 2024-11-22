import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import Toastify
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isToastShown, setIsToastShown] = useState(false); // State to track notification

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin();

        if (!isToastShown) { // Ensure toast is shown only once
          toast.success("Login successful!", { autoClose: 2000 });
          setIsToastShown(true); // Mark toast as shown
        }

        navigate("/"); // Redirect to home after successful login
      } else {
        if (data.error === "User not found") {
          toast.warn("User not found. Redirecting to signup...", { autoClose: 3000 });
          navigate("/signup", { state: { email } });
        } else {
          toast.error(data.error || "Login failed. Please try again.", { autoClose: 3000 });
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.", { autoClose: 3000 });
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
          <button
            type="button"
            className="signup-button"
            onClick={handleSignupRedirect}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
