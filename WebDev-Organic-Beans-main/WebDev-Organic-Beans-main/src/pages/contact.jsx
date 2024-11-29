import './contact.css';
import contactIcon from '../pages/contactIcon.png'; 
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", { name, email, message }); // Log form data
  
    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
  
      if (response.ok) {
        console.log("Message sent successfully"); // Log success
        toast.success("Message sent successfully!", {
          position: "top-right", // Replace toast.POSITION.TOP_RIGHT with a string
          autoClose: 3000
        });
        
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData); // Log error response
        toast.error(`Error: ${errorData.error}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error("Error sending contact message:", error);
      toast.error("An error occurred. Please try again later.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
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
