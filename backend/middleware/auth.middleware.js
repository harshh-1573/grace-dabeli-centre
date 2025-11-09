// In backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

// This function is our "security guard"
module.exports = function(req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('Authorization');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    // The token looks like "Bearer [token]". We split it and get just the token part.
    const tokenOnly = token.split(' ')[1];
    
    // Check if the token is valid using our secret key
    const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);

    // If valid, add the user data to the request object
    // so our protected routes can use it
    req.user = decoded.user;
    
    // Call 'next()' to proceed to the actual API route
    next();

  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};