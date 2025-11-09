const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- 1. SCHEMAS FOR MODIFIER STRUCTURE ---
// Represents a single choice the user can make (e.g., "Extra Cheese")
const modifierOptionSchema = new Schema({
    name: { type: String, required: true, trim: true }, // e.g., "Add Extra Cheese"
    price: { type: Number, default: 0 },              // e.g., 20
});

// Represents a group of choices (e.g., "Add-Ons" or "Sauce Options")
const modifierGroupSchema = new Schema({
    groupName: { type: String, required: true, trim: true }, // e.g., "Add-Ons" or "Spiciness"
    
    // Defines whether the user can pick one option (radio) or multiple (checkboxes)
    selectionType: { 
        type: String, 
        enum: ['single', 'multiple'], 
        default: 'single' 
    },
    
    // The list of choices available in this group
    options: [modifierOptionSchema]
}, { _id: false }); // We don't need IDs for these nested groups

// --- END OF SCHEMAS ---

const menuItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  
  // --- 2. NEW FIELD: MODIFIERS ---
  modifiers: [modifierGroupSchema],
  // --- END NEW FIELD ---

}, {
  timestamps: true,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
