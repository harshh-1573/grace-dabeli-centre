const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the blueprint for a single item *within* an order
const orderItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  note: { type: String, required: false, trim: true, default: '' }
});

// This is the blueprint for the main order
const orderSchema = new Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'Customer' 
  },

  // --- 1. NEW FIELD: Order Type ---
  orderType: {
    type: String,
    required: true,
    enum: ['Delivery', 'Pickup'],
    default: 'Delivery'
  },
  // --- END NEW FIELD ---
  
  // --- 2. UPDATED FIELD: Delivery Address is now CONDITIONAL ---
  deliveryAddress: {
    street: {
      type: String,
      // This function makes the field required ONLY if orderType is 'Delivery'
      required: function() { return this.orderType === 'Delivery'; },
      trim: true
    },
    city: {
      type: String,
      required: function() { return this.orderType === 'Delivery'; },
      trim: true
    },
    pincode: {
      type: String,
      required: function() { return this.orderType === 'Delivery'; },
      trim: true
    }
  },
  // --- END UPDATED FIELD ---

  // An order contains an array of items,
  // which follow the 'orderItemSchema'
  items: [orderItemSchema], 
  
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;