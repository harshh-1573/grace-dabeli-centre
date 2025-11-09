// In backend/routes/auth.js

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');

// --- 1. REGISTER A NEW ADMIN USER (DISABLED) ---
// POST /api/auth/register
/* --- ROUTE DISABLED START ---
router.route('/register').post(async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username is provided
    if (!username || !password) {
      return res.status(400).json('Error: Username and password are required.');
    }

    // Check if the user already exists
    let user = await User.findOne({ username: username.toLowerCase() });
    if (user) {
      return res.status(400).json('Error: This admin user already exists.');
    }

    // Create a new user (password will be hashed by the pre-save hook in user.model.js)
    user = new User({
      username: username.toLowerCase(),
      password: password,
    });

    await user.save();
    res.status(201).json('Admin user created successfully!');

  } catch (error) {
    res.status(500).json('Server Error: ' + error);
  }
});
--- ROUTE DISABLED END --- */


// --- 2. LOGIN THE ADMIN USER (Remains Active) ---
// POST /api/auth/login
router.route('/login').post(async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(400).json('Invalid credentials'); // Use a generic message
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Invalid credentials');
    }

    // If login is successful, create a JWT token
    const payload = {
      user: {
        id: user.id, // This is the user's MongoDB _id
      }
    };

    // Sign the token with our secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' }, // The token will be valid for 8 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to the frontend
      }
    );

  } catch (error) {
    console.error("Admin Login Error:", error); // Added console log for server errors
    res.status(500).json('Server Error during admin login');
  }
});


module.exports = router;