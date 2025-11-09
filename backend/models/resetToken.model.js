// In backend/models/resetToken.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resetTokenSchema = new Schema({
  owner: {
    // Links this token to the Customer who requested the reset
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
    unique: true // A customer should only have one active token at a time
  },
  token: {
    // The actual token string the user will enter
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    // --- CRITICAL SECURITY FEATURE ---
    // This creates an index that automatically deletes the document 
    // 1 hour (3600 seconds) after creation.
    expires: 3600 
  }
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

module.exports = ResetToken;