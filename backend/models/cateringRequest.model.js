const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reusable schema for items in the catering order (Snapshot in Time)
const cateringItemSchema = new Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    pricePerUnit: { type: Number, required: true }, 
    note: { type: String, trim: true } 
});

const cateringRequestSchema = new Schema({
    
    // --- 1. CUSTOMER & CONTACT INFO (Unchanged) ---
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
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
    customerEmail: {
        type: String,
        trim: true,
        lowercase: true
    },

    // --- 2. EVENT DETAILS (Unchanged) ---
    eventType: { 
        type: String,
        required: true,
        trim: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    guestCount: {
        type: Number,
        required: true,
        min: [10, 'Catering requests must be for a minimum of 10 guests.'] 
    },
    
    // --- 3. UPDATED: SERVICE & VENUE DETAILS ---
    
    // --- (REMOVED old 'cateringType' and 'serviceType' fields) ---

    // --- NEW: Single Service Option field ---
    serviceOption: { 
        type: String,
        required: true,
        enum: ['Home Delivery', 'Self Pickup', 'Full Services'],
        default: 'Home Delivery'
    },
    venueName: { 
        type: String,
        required: true,
        trim: true
    },
    venueAddress: { // A detailed address string
        type: String,
        // --- FIX: Address is now required *only* for Delivery or Full Service ---
        required: function() { 
          return this.serviceOption === 'Home Delivery' || this.serviceOption === 'Full Services'; 
        },
        trim: true
    },
    // --- END UPDATED SECTION ---

    // --- 4. THE MENU & PRICING (Unchanged) ---
    menuItems: [cateringItemSchema],
    estimatedTotal: { 
        type: Number,
        required: true
    },

    // --- 5. ADMIN/STATUS FIELDS (Unchanged) ---
    status: {
        type: String,
        enum: ['Pending Review', 'Confirmed', 'Negotiating', 'Rejected', 'Completed'],
        default: 'Pending Review'
    },
    adminNotes: {
        type: String,
        trim: true
    }

}, {
    timestamps: true,
});

const CateringRequest = mongoose.model('CateringRequest', cateringRequestSchema);

module.exports = CateringRequest;

