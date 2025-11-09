// In backend/middleware/customerAuth.middleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const tokenHeader = req.header('Authorization');
  if (!tokenHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const token = tokenHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the decoded payload has the 'customer' property
    if (!decoded.customer) throw new Error('Not a customer token');
    req.customerId = decoded.customer.id; // Store customer ID
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid or not a customer token' });
  }
};