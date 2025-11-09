const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure it can read the JWT_SECRET

// This is a function that takes 'io' as an argument
module.exports = function(io) {
  
  // This runs every time a new client connects
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // --- NEW: LOGIC FOR CUSTOMER AUTHENTICATION ---
    // 1. Listen for a "hello" message from a customer
    socket.on('authenticate_customer', (token) => {
      if (!token) {
        console.log(`[Socket.IO] Client ${socket.id} tried to auth without a token.`);
        return;
      }

      try {
        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Get the customer's ID from the token payload
        // (This payload must match what you create in your /login route)
        const customerId = decoded.customer.id; 

        if (customerId) {
          // 4. Join a private room named after their customerId
          socket.join(customerId);
          console.log(`[Socket.IO] Client ${socket.id} authenticated and joined room: ${customerId}`);
        }
      } catch (err) {
        console.log(`[Socket.IO] Client ${socket.id} sent an invalid token.`);
      }
    });
    // --- END OF NEW LOGIC ---

    // This runs when that client disconnects
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

};
