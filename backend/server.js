require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); 
const { Server } = require("socket.io"); 

// Import all our routes
const menuRouter = require('./routes/menu');
const ordersRouter =require('./routes/orders');
const authRouter = require('./routes/auth');
const analyticsRouter = require('./routes/analytics');
const feedbackRouter = require('./routes/feedback');
const customerRouter = require('./routes/customers');
const cateringRouter = require('./routes/catering'); 

const app = express();
const PORT = process.env.PORT || 5001;

// --- ⬇️ NEW/MODIFIED CORS CONFIGURATION ⬇️ ---

// 1. Define the single, allowed URL. We get it from environment variables.
//    Render will provide the CLIENT_URL. If not, we fall back to localhost.
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: CLIENT_URL
};

// 2. Use the new options for your main Express API
app.use(cors(corsOptions));
app.use(express.json());

// --- SOCKET.IO ---
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL, // 3. Use the same variable for Socket.IO
    methods: ["GET", "POST"]
  }
});
// --- ⬆️ END OF MODIFICATIONS ⬆️ ---

// --- SOCKET.IO ---
const socketManager = require('./socketManager')(io); 

// --- Pass 'io' to our routes ---
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- THIS IS THE FIX ---
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/customers', customerRouter);
app.use('/api/catering', cateringRouter); 


// Test Route
app.get('/', (req, res) => {
  res.send('Grace Dabeli API is running!');
});

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:');
    console.error(err);
  });