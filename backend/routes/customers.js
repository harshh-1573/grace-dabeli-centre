const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const customerAuth = require('../middleware/customerAuth.middleware');
const auth = require('../middleware/auth.middleware');
const crypto = require('crypto'); 

let Customer = require('../models/customer.model');
let ResetToken = require('../models/resetToken.model');

// --- 1. REGISTER A NEW CUSTOMER (Unchanged) ---
router.route('/register').post(async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;
    if (!name || !phone || !password) { return res.status(400).json('Error: Name, phone, and password are required.'); }
    let existingPhone = await Customer.findOne({ phone: phone });
    if (existingPhone) { return res.status(400).json('Error: This phone number is already registered.'); }
    if (email) {
      if (email.trim() !== '') {
         let existingEmail = await Customer.findOne({ email: email.toLowerCase() });
         if (existingEmail) { return res.status(400).json('Error: This email address is already registered.'); }
      }
    }
    const customer = new Customer({
      name,
      phone,
      password,
      email: (email && email.trim() !== '') ? email.toLowerCase() : undefined,
    });
    await customer.save();
    const payload = { customer: { id: customer.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (error) {
     if (error.name === 'ValidationError') {
     return res.status(400).json(`Validation Error: ${error.message}`);
     }
    console.error("Registration Error:", error);
    res.status(500).json('Server Error during registration');
  }
});


// --- 2. LOGIN A CUSTOMER (Unchanged) ---
router.route('/login').post(async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) { return res.status(400).json('Error: Phone and password are required.'); }
    const customer = await Customer.findOne({ phone: phone });
    if (!customer) { return res.status(400).json('Invalid credentials'); }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) { return res.status(400).json('Invalid credentials'); }
    const payload = { customer: { id: customer.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json('Server Error during login');
  }
});


// --- 3. GET LOGGED IN CUSTOMER DETAILS (Slightly modified) ---
router.route('/me').get(customerAuth, async (req, res) => {
  try {
    // We now select '-addresses' to avoid sending all addresses with this main request
    const customer = await Customer.findById(req.customerId).select('-password -addresses');
    if (!customer) { return res.status(404).json({ msg: 'Customer not found' }); }
    res.json(customer);
  } catch (err) {
    console.error("Get /me Error:", err.message);
    res.status(500).send('Server Error');
  }
});


// --- 4. GET ALL REGISTERED CUSTOMERS (ADMIN ONLY - Unchanged) ---
router.route('/all').get(auth, async (req, res) => { 
    try {
        const customers = await Customer.find().select('-password');
        res.status(200).json({
            count: customers.length,
         customers: customers
        });
    } catch (err) {
        console.error("Error fetching all customers:", err);
        res.status(500).json('Server Error fetching customer list.');
    }
});



// --- 5. FORGOT PASSWORD (Unchanged) ---
router.route('/forgot-password').post(async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json('Error: Phone number is required.');
        }
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            console.log(`[PASS RESET] Request received for non-existent phone: ${phone}`);
            return res.status(200).json({ message: 'If an account exists, a reset code will be sent.' });
        }
        console.log(`[PASS RESET] Customer found: ${customer.name}. Generating token...`);
        await ResetToken.findOneAndDelete({ owner: customer._id });
        const tokenValue = crypto.randomInt(100000, 999999).toString();
        const hashedToken = await bcrypt.hash(tokenValue, 10); 
        const newToken = new ResetToken({
            owner: customer._id,
            token: hashedToken,
        });
        await newToken.save(); 
        console.log(`--- DEVELOPMENT TOKEN: ${tokenValue} ---`); // LOG THE TOKEN VALUE
        res.status(200).json({ 
            message: 'Reset code generated successfully.',
            dev_token: tokenValue, // <<< TEMPORARY FOR TESTING
        });
    } catch (err) {
        console.error("Forgot Password Fatal Error:", err); 
        res.status(500).json('Server Error during password reset request.');
    }
});

// --- 6. RESET PASSWORD (Unchanged) ---
router.route('/reset-password').post(async (req, res) => {
    try {
        const { phone, token, newPassword } = req.body;
        if (!phone || !token || !newPassword) {
            return res.status(400).json('Error: Phone, code, and new password are required.');
        }
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(400).json('Invalid request.');
        }
        const resetToken = await ResetToken.findOne({ owner: customer._id });
        if (!resetToken) {
            return res.status(400).json('Code is invalid or has expired.');
        }
        const isValid = await bcrypt.compare(token, resetToken.token);
        if (!isValid) {
            return res.status(400).json('Invalid reset code provided.');
     }
        customer.password = newPassword; // Pre-save hook will hash this!
        await customer.save();
        await ResetToken.findOneAndDelete({ owner: customer._id });
        res.status(200).json('Password reset successfully. You can now log in.');
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json('Server Error during password reset.');
T   }
});


// --- 7. UPDATE CUSTOMER PROFILE (Unchanged) ---
router.put('/me/update', customerAuth, async (req, res) => {
    const { name, email, phone } = req.body;
    const customerId = req.customerId; // From customerAuth middleware
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
       }
        // Check if new email is already taken by ANOTHER user
        if (email && email.toLowerCase() !== customer.email) {
            const emailExists = await Customer.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json('Error: This email address is already registered.');
            }
            customer.email = email.toLowerCase();
        }
        // Check if new phone is already taken by ANOTHER user
        if (phone && phone !== customer.phone) {
            const phoneExists = await Customer.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json('Error: This phone number is already registered.');
            }
            customer.phone = phone;
        }
        // Update name
        if (name) {
            customer.name = name;
        }
        const updatedCustomer = await customer.save();
        // Send back updated info (excluding password)
        res.json({
            _id: updatedCustomer._id,
            name: updatedCustomer.name,
            phone: updatedCustomer.phone,
            email: updatedCustomer.email
        });
    } catch (err) {
        console.error("Error updating profile:", err);
      res.status(500).json('Server Error');
    }
});

// --- 8. (NEW) CHANGE PASSWORD (CUSTOMER ONLY) ---
// Protected by customer auth middleware
router.post('/me/change-password', customerAuth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const customerId = req.customerId;
    if (!oldPassword || !newPassword) {
        return res.status(400).json('Error: Old and new passwords are required.');
    }
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }
        // 1. Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, customer.password);
        if (!isMatch) {
            return res.status(400).json('Error: Incorrect old password.');
        }
        // 2. Set new password (pre-save hook will hash it)
        customer.password = newPassword;
        await customer.save();
        res.json('Password changed successfully.');
css   } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json('Server Error');
    }
});


// --- START OF NEW CODE ---
// This block is now CORRECTLY PLACED *after* route 8

// =======================================
// --- 9. (NEW) GET CUSTOMER'S SAVED ADDRESSES ---
// =======================================
router.get('/me/addresses', customerAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId).select('addresses');
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.json(customer.addresses);
  } catch (err) {
    console.error("Error fetching addresses:", err);
    res.status(500).json('Server Error');
  }
});

// =======================================
// --- 10. (NEW) ADD A NEW ADDRESS ---
// =======================================
router.post('/me/addresses', customerAuth, async (req, res) => {
  const { addressType, street, city, pincode } = req.body;
  if (!street || !city || !pincode) {
    return res.status(400).json('Error: Street, city, and pincode are required.');
  }
  try {
    const customer = await Customer.findById(req.customerId);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    const newAddress = { addressType, street, city, pincode };
    customer.addresses.push(newAddress);
    await customer.save();
    res.status(201).json(customer.addresses[customer.addresses.length - 1]);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json(`Validation Error: ${err.message}`);
    }
    console.error("Error adding address:", err);
    res.status(500).json('Server Error');
  }
});

// =======================================
// --- 11. (NEW) UPDATE AN EXISTING ADDRESS ---
// =======================================
router.put('/me/addresses/:addressId', customerAuth, async (req, res) => {
  const { addressId } = req.params;
  const { addressType, street, city, pincode } = req.body;
  try {
    const customer = await Customer.findById(req.customerId);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    const address = customer.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }
    address.addressType = addressType || address.addressType;
    address.street = street || address.street;
    address.city = city || address.city;
    address.pincode = pincode || address.pincode;
    await customer.save();
    res.json(address);
  } catch (err) {
     if (err.name === 'ValidationError') {
      return res.status(400).json(`Validation Error: ${err.message}`);
    }
    console.error("Error updating address:", err);
    res.status(500).json('Server Error');
  }
});

// =======================================
// --- 12. (NEW) DELETE AN ADDRESS ---
// =======================================
router.delete('/me/addresses/:addressId', customerAuth, async (req, res) => {
  const { addressId } = req.params;
  try {
    const customer = await Customer.findById(req.customerId);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    const address = customer.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }
    customer.addresses.pull(addressId);
    await customer.save();
    res.json(customer.addresses);
  } catch (err) {
    console.error("Error deleting address:", err);
    res.status(500).json('Server Error');
  }
});

// --- END OF NEW CODE ---

module.exports = router;