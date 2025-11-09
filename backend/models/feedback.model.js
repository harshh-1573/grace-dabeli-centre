const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    contact: { 
        type: String, 
        required: false, // Optional, as per your form
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum 1 star
        max: 5, // Maximum 5 stars
    },
    message: { 
        type: String, 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    // --- NEW FIELD ---
    isPublic: {
        type: Boolean, 
        default: false // Only shows if admin explicitly approves it
    }
    // --- END NEW FIELD ---
}, {
    timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
