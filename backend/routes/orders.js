const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const customerAuth = require('../middleware/customerAuth.middleware'); // Customer guard
const auth = require('../middleware/auth.middleware'); // Admin guard
const MenuItem = require('../models/menuItem.model');

// =======================================
// 1️⃣ GET ALL ORDERS (ADMIN ONLY - Unchanged)
// =======================================
router.get('/', auth, async (req, res) => {
  try {
    const { status, search, limit, quickFilter } = req.query; 
    let matchCondition = {};
    let queryLimit = parseInt(limit) || 0; 

    if (quickFilter === '24hrs') {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        matchCondition.createdAt = { $gte: twentyFourHoursAgo }; 
    }
    
    if (status && status !== 'All') {
        matchCondition.status = status;
    }

    if (search) {
        const searchRegex = new RegExp(search, 'i');
        matchCondition.$or = [
            { customerName: searchRegex },
            { customerPhone: searchRegex }
        ];
    }
    
    let query = Order.find(matchCondition).sort({ createdAt: -1 });

    if (queryLimit > 0) {
        query = query.limit(queryLimit);
    }

    const orders = await query.exec(); 

    res.json(orders);
  } catch (err) {
    console.error("Error fetching filtered orders:", err);
    res.status(500).json('Server Error');
  }
});



// In backend/routes/orders.js

// =======================================
// 2️⃣ ADD A NEW ORDER (UPDATED FOR ORDER TYPE)
// =======================================
router.post('/add', customerAuth, async (req, res) => {
  const customerId = req.customerId;
  
  // --- 1. Destructure 'orderType' from the body ---
  const { items: cartItems, deliveryAddress, orderType } = req.body; 

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json('Error: Order items are required.');
  }
  
  // --- 2. UPDATED: Conditional Address Validation ---
  // The 'orderType' field itself will be validated by the Mongoose schema (enum/default)
  if (orderType === 'Delivery' && (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode)) {
    // Only validate address if it's a 'Delivery' order
    return res.status(400).json('Error: A complete delivery address is required for delivery.');
  }

  try {
    const customer = await Customer.findById(customerId).select('name phone');
    if (!customer) {
      return res.status(404).json('Error: Customer not found.');
    }

    let serverTotalPrice = 0;
    const orderItemsForDb = []; 

    // This price calculation loop is unchanged and secure
    for (const cartItem of cartItems) {
      const menuItem = await MenuItem.findById(cartItem.menuItemId);
      if (!menuItem) {
        return res.status(404).json(`Error: Item not found.`);
      }

      const modifierPriceMap = new Map();
      menuItem.modifiers.flatMap(g => g.options).forEach(opt => {
        modifierPriceMap.set(opt.name, opt.price);
      });

      let calculatedItemPrice = menuItem.price;
      let modifierNotes = [];

      if (cartItem.selectedModifiers && cartItem.selectedModifiers.length > 0) {
        for (const clientMod of cartItem.selectedModifiers) {
          const trueModifierPrice = modifierPriceMap.get(clientMod.name);

          if (trueModifierPrice === undefined) {
            return res.status(400).json(`Error: Invalid modifier '${clientMod.name}'.`);
          }
          if (trueModifierPrice !== clientMod.price) {
            return res.status(400).json(`Error: Price mismatch for '${clientMod.name}'.`);
          }
          calculatedItemPrice += trueModifierPrice;
          modifierNotes.push(clientMod.name);
        }
      }
      
      let finalNote = cartItem.note || '';
      if (modifierNotes.length > 0) {
        const modifierString = `(Mods: ${modifierNotes.join(', ')})`;
        finalNote = finalNote ? `${finalNote} ${modifierString}` : modifierString;
      }

      orderItemsForDb.push({
        name: menuItem.name,
        price: calculatedItemPrice, 
        quantity: cartItem.quantity,
        note: finalNote
      });

      serverTotalPrice += calculatedItemPrice * cartItem.quantity;
    }

    // --- 3. Add 'orderType' to the new Order object ---
    const newOrder = new Order({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerId,
      orderType: orderType, // <-- THIS IS THE NEW LINE
      // This is safe. If it's a Pickup order, deliveryAddress will be undefined
      // and our model will correctly allow it.
      deliveryAddress: deliveryAddress, 
      items: orderItemsForDb, 
      totalPrice: serverTotalPrice, 
    });

    const savedOrder = await newOrder.save(); // This will now work for both types

    if (req.io) req.io.emit('new_order', savedOrder);

    res.status(201).json({ 
      message: 'Order added successfully!', 
      orderId: savedOrder._id 
    });
  } catch (err) {
    console.error("Error adding order:", err); 
    res.status(500).json('Server Error: Could not place order.');
  }
});

// =======================================
// 3️⃣ UPDATE ORDER STATUS (ADMIN ONLY - NEW SAFER VERSION)
// =======================================
router.patch('/update/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Get the status from the request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json('Invalid Order ID format.');
    }

    const allowedStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json('Invalid status provided.');
    }

    // --- THIS IS THE NEW, SAFER CODE ---
    // We find and update in a single, atomic operation.
    // This will NOT run full-document validation, so it won't
    // throw an error for the missing address on old orders.
    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      { status: status }, // The update we want to apply
      { new: true } // This option tells Mongoose to return the *updated* document
    );
    // --- END OF NEW CODE ---

    if (!updatedOrder) {
      return res.status(404).json('Order not found.');
    }

    // Socket.IO logic is the same
    if (req.io && updatedOrder.customerId) {
      req.io.to(updatedOrder.customerId.toString()).emit('order_update', updatedOrder);
      console.log(`[Socket.IO] Emitted 'order_update' to room: ${updatedOrder.customerId}`);
    }

    res.json('Order status updated!');
  } catch (err) {
    // This console.error will no longer be triggered by this bug
    console.error("Error updating order status:", err);
    res.status(500).json('Server Error');
  }
});

// =======================================
// 4️⃣ FIND ORDERS BY PHONE (PUBLIC ROUTE - Unchanged)
// =======================================
router.get('/track/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json('Invalid phone number format.');
    }

    const orders = await Order.find({ customerPhone: phone }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json('No orders found for this phone number.');
    }

    res.json(orders);
  } catch (err) {
    console.error("Error tracking orders:", err);
    res.status(500).json('Server Error');
  }
});

// =======================================
// 5️⃣ GET LOGGED-IN CUSTOMER ORDER HISTORY (Unchanged)
// =======================================
router.get('/myorders', customerAuth, async (req, res) => {
  try {
    const customerId = req.customerId;
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching customer orders:", err);
    res.status(500).json('Server Error fetching customer history.');
  }
});

// =======================================
// 6️⃣ (NEW) GET ALL ORDERS FOR A SPECIFIC CUSTOMER (ADMIN ONLY)
// =======================================
router.get('/bycustomer/:customerId', auth, async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json('Invalid Customer ID format.');
    }
    
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    
    res.json(orders); // Send back the list of orders

  } catch (err) {
    console.error("Error fetching orders by customer ID:", err);
    res.status(500).json('Server Error');
  }
});


module.exports = router;

