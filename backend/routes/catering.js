// routes/cateringRoutes.js

const router = require('express').Router();
const Customer = require('../models/customer.model');
const CateringRequest = require('../models/cateringRequest.model');
const customerAuth = require('../middleware/customerAuth.middleware');
const auth = require('../middleware/auth.middleware'); // ✅ Admin authentication

// =====================================================
// 1️⃣ SUBMIT A NEW CATERING REQUEST (CUSTOMER ONLY)
// POST /api/catering/submit
// =====================================================
router.post('/submit', customerAuth, async (req, res) => {
  const customerId = req.customerId;
  const {
    eventType,
    eventDate,
    eventTime,
    guestCount,
    serviceOption, // ✅ new 3-option field
    venueName,
    venueAddress,
    menuItems: clientMenuItems,
    estimatedTotal
  } = req.body;

  if (!clientMenuItems || clientMenuItems.length === 0) {
    return res.status(400).json('Error: Menu items are required for the quote.');
  }

  // ✅ Conditional validation
  if ((serviceOption === 'Home Delivery' || serviceOption === 'Full Services') && (!venueAddress || venueAddress.trim() === '')) {
    return res.status(400).json({ message: 'Validation Error: Venue Address is required for this service type.' });
  }

  try {
    // 1️⃣ Fetch Customer Info
    const customer = await Customer.findById(customerId).select('name phone email');
    if (!customer) return res.status(404).json('Error: Customer not found.');

    // 2️⃣ Security Check: Recalculate total on server
    let serverCalculatedTotal = 0;
    const finalMenuItems = clientMenuItems.map(item => {
      serverCalculatedTotal += item.pricePerUnit * item.quantity;
      return {
        name: item.name,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        note: item.note || ''
      };
    });

    if (Math.abs(serverCalculatedTotal - estimatedTotal) > 0.01) {
      console.warn(`⚠ SECURITY ALERT: Client total (${estimatedTotal}) != Server total (${serverCalculatedTotal}).`);
    }

    // 3️⃣ Create Request Document
    const newRequest = new CateringRequest({
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      eventType,
      eventDate,
      eventTime,
      guestCount,
      serviceOption,
      venueName,
      venueAddress: (serviceOption === 'Home Delivery' || serviceOption === 'Full Services')
        ? venueAddress
        : 'N/A (Pickup)',
      menuItems: finalMenuItems,
      estimatedTotal: serverCalculatedTotal,
      status: 'Pending Review'
    });

    const savedRequest = await newRequest.save();

    // 4️⃣ Notify Admin Dashboard
    if (req.io) {
      req.io.emit('new_catering_request', savedRequest);
      console.log(`[Socket.IO] → new_catering_request emitted (ID: ${savedRequest._id})`);
    }

    res.status(201).json({
      message: 'Catering request submitted successfully!',
      requestId: savedRequest._id
    });
  } catch (err) {
    console.error('❌ Catering Submission Error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json(`Validation Error: ${err.message}`);
    }
    res.status(500).json('Server Error: Could not process catering request.');
  }
});

// =====================================================
// 2️⃣ GET ALL CATERING REQUESTS (ADMIN ONLY)
// GET /api/catering/all
// =====================================================
router.get('/all', auth, async (req, res) => {
  try {
    const requests = await CateringRequest.find().sort({ createdAt: -1 }); // ✅ Newest first
    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching catering requests:', err);
    res.status(500).json('Server Error fetching catering requests.');
  }
});

// =====================================================
// 3️⃣ GET *MY* CATERING REQUESTS (CUSTOMER ONLY)
// GET /api/catering/my-requests
// =====================================================
router.get('/my-requests', customerAuth, async (req, res) => {
  try {
    const requests = await CateringRequest.find({ customerId: req.customerId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('❌ Error fetching *my* catering requests:', err);
    res.status(500).json('Server Error fetching your catering requests.');
  }
});

// =====================================================
// 4️⃣ UPDATE CATERING REQUEST STATUS (ADMIN ONLY)
// PATCH /api/catering/update-status/:id
// =====================================================
router.patch('/update-status/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  try {
    const allowedStatuses = [
      'Pending Review',
      'Confirmed',
      'Negotiating',
      'Rejected',
      'Completed'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json('Invalid status provided.');
    }

    const updatedRequest = await CateringRequest.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json('Request not found.');
    }

    // ✅ Notify specific customer about the update
    if (req.io && updatedRequest.customerId) {
      req.io.to(updatedRequest.customerId.toString()).emit('catering_update', updatedRequest);
      console.log(`[Socket.IO] → catering_update emitted to room: ${updatedRequest.customerId}`);
    }

    res.json(updatedRequest);
  } catch (err) {
    console.error('❌ Error updating catering status:', err);
    res.status(500).json('Server Error.');
  }
});

module.exports = router;
