import React, { useState, useEffect } from 'react';
import './checkout.css';
import { toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchCartAndAddress = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warn("Please log in first.", { autoClose: 3000 });
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/checkout", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.cart);
          setFormData({
            ...formData,
            email: data.email || '',
            address: data.address?.street || '',
            city: data.address?.city || '',
            postalCode: data.address?.postalCode || '',
          });
          setLoading(false);
        } else {
          console.error("Failed to load checkout data:", await response.json());
          toast.error("Failed to load checkout data.", { autoClose: 3000 });
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        toast.error("An error occurred. Please try again.", { autoClose: 3000 });
      }
    };

    fetchCartAndAddress();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to save the address
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("Please log in first.", { autoClose: 3000 });
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/save-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          address: {
            street: formData.address,
            city: formData.city,
            postalCode: formData.postalCode
          }
        })
      });

      if (response.ok) {
        toast.success("Address saved successfully!", { autoClose: 3000 });
        placeOrder(); // Call placeOrder after address is saved
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save address.", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("An error occurred. Please try again.", { autoClose: 3000 });
    }
  };

  // Function to place the order
  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    // Check if an order has already been placed and the cart is not empty
    if (orderPlaced && cartItems.length > 0) {
      toast.warn(
        "You already have an order placed. Please clear the cart before placing a new order.",
        { autoClose: 3000 }
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("Order placed successfully!", { autoClose: 3000 });
        setOrderPlaced(true); // Mark that an order has been placed
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to place order.", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred. Please try again.", { autoClose: 3000 });
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/clear-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems([]); // Clear the cart in the frontend state
        toast.success("Cart cleared successfully.", { autoClose: 3000 });
        setOrderPlaced(false); // Reset the orderPlaced flag so the user can place a new order
      } else {
        toast.error("Failed to clear cart.", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="checkout-container">
      <div className="form-section">
        <h2>Checkout</h2>
        <p>This is a <strong>Delivery Order 🛵</strong></p>
        <p>Just a last step, please enter your details:</p>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Delivery Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />

          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />

          <label>Postal Code</label>
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />

          <button type="submit" className="checkout-button">Place Order</button>
        </form>
      </div>

      <div className="cart-section">
        <h3>Your Order</h3>
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <span>{item.name}</span>
              <span>Rs. {item.price || "N/A"}</span>
            </div>
          ))}
        </div>
        <div className="total">
          <h4>Grand Total</h4>
          <span>Rs. {total}</span>
        </div>
        <button onClick={clearCart} className="clear-cart-button">Clear Cart</button>
      </div>
    </div>
  );
};

export default Checkout;
