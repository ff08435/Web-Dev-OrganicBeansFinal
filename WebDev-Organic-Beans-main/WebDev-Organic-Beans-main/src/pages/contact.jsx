import './contact.css';
import contactIcon from '../pages/contactIcon.png'; 
import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll get back to you soon.");
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>
        Have any questions or feedback? Use the form below to get in touch, and we’ll respond promptly.
      </p>

      <div className="contact-content">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here"
            required
          />

          <button type="submit" className="contact-button">Send Message</button>
        </form>

        <div className="contact-icon-container">
          <img src={contactIcon} alt="Contact Icon" className="contact-icon" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
