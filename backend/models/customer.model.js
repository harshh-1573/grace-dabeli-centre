// In backend/models/customer.model.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// --- 1. NEW: Sub-schema for a single address ---
// This defines the structure for one address.
// We are creating it separately so it's clean and reusable.
const addressSchema = new Schema({
  addressType: { // e.g., "Home", "Work", "Other"
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home',
    required: true
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
    // Basic 6-digit Indian Pincode validation
    match: [/^[1-9][0-9]{5}$/, 'Please fill a valid Indian pincode']
  }
}, { 
  // This gives each address its own unique _id
  _id: true, 
  timestamps: true // Good to know when an address was added
});


// --- 2. UPDATED: Customer Schema ---
const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Phone should be unique
    trim: true
  },
  email: { 
    type: String,
    required: false, 
    unique: true,
    sparse: true, // Allows multiple null/undefined values despite 'unique'
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },

  // --- 3. THIS IS THE NEW FIELD ---
  // We are embedding the addressSchema as an array.
  // This allows a customer to have multiple saved addresses.
  addresses: [addressSchema]
  // --- END OF NEW FIELD ---

}, { timestamps: true });


// --- Pre-save hook to hash password (Unchanged) ---
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;