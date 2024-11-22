import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "your_jwt_secret"; // Replace with a secure secret in production

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/organicbeans')
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define User schema with Cart and Address
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cart: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  orders: [
    {
      items: [
        {
          productId: String,
          name: String,
          quantity: Number,
          price: Number
        }
      ],
      address: {
        street: String,
        city: String,
        state: String,
        zip: String
      },
      totalAmount: Number,
      orderDate: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', userSchema);

// Signup Route with additional logging
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Signup request received:", req.body);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log("User saved to database");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ message: "Login successful", token });
});

// Add to Cart Route with token verification
// Add to Cart Route with token verification
app.post('/cart', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { product } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if product already exists in the cart
    const cartItemIndex = user.cart.findIndex(item => item.productId === product.productId);
    if (cartItemIndex !== -1) {
      user.cart[cartItemIndex].quantity += 1;
    } else {
      user.cart.push({ ...product, quantity: 1 });
    }
    await user.save();

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Save or Update Address Route
app.post('/save-address', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.address = address;
    await user.save();

    res.status(200).json({ message: "Address saved successfully", address: user.address });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ error: "Failed to save address" });
  }
});

// Retrieve Cart and Address for Checkout
app.get('/checkout', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ cart: user.cart, address: user.address });
  } catch (error) {
    console.error("Error retrieving checkout details:", error);
    res.status(500).json({ error: "Failed to retrieve checkout details" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post('/place-order', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user || user.cart.length === 0) return res.status(400).json({ error: "Cart is empty" });

    // Calculate total amount
    const totalAmount = user.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create a new order object
    const newOrder = {
      items: user.cart,
      address: user.address,
      totalAmount: totalAmount,
      orderDate: new Date()
    };

    // Add the new order to the user's orders array
    user.orders.push(newOrder);

    // Save the user with the updated orders array
    await user.save();

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});


app.post('/clear-cart', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token received:", token); // Log the token to ensure it's being sent

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found for ID:", userId); // Log if user is not found
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Clearing cart for user:", user.email); // Log user email if found
    user.cart = []; // Set cart to an empty array
    await user.save(); // Save to database
    console.log("Cart after clearing:", user.cart); // Log cart contents after clearing

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});


