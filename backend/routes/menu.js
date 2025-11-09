const router = require('express').Router();
let MenuItem = require('../models/menuItem.model');
const auth = require('../middleware/auth.middleware'); // ADMIN auth
const mongoose = require('mongoose'); // Moved to top
const upload = require('../config/cloudinary'); // <-- 1. IMPORT CLOUDINARY UPLOAD

// --- 1. GET ALL MENU ITEMS (PUBLIC - FOR CUSTOMERS) ---
// (Unchanged)
router.route('/').get(async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    query.inStock = true; 

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search && search.trim() !== '') {
      query.name = { $regex: search.trim(), $options: 'i' }; 
    }
    // We send the modifiers to the customer
    const menuItems = await MenuItem.find(query); 
    res.json(menuItems);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json('Error: ' + err);
  }
});

// --- 2. GET ALL CATEGORIES (PUBLIC - FOR CUSTOMERS) ---
// (Unchanged)
router.route('/categories').get(async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category', { inStock: true });
    res.json(['All', ...categories.filter(cat => cat)]);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json('Error: ' + err);
  }
});

// --- 3. GET FEATURED ITEMS (PUBLIC) ---
// (Unchanged)
router.route('/featured').get(async (req, res) => {
  try {
    // We send modifiers for featured items too
    const featuredItems = await MenuItem.find({ 
      inStock: true, 
      isFeatured: true 
    });
    res.json(featuredItems);
  } catch (err) {
    console.error("Error fetching featured items:", err);
    res.status(500).json('Error: ' + err);
  }
});

// --- 4. GET ALL MENU ITEMS (ADMIN ONLY) ---
// (Unchanged)
router.route('/all').get(auth, async (req, res) => {
  try {
    const menuItems = await MenuItem.find(); // <-- Modifiers are included here
    res.json(menuItems);
  } catch (err) {
    console.error("Error fetching all menu items for admin:", err);
    res.status(500).json('Error: ' + err);
  }
});


// --- 5. ADD A NEW MENU ITEM (ADMIN ONLY - PROTECTED) ---
// (Unchanged - We will upload the image first, then call this route)
router.route('/add').post(auth, (req, res) => {
  const { name, price, category, imageUrl, modifiers } = req.body; 
  
  if (!name || !price || !category) {
    return res.status(400).json('Error: Name, price, and category are required.');
  }
  const newItem = new MenuItem({
    name,
    price: Number(price),
    category,
    imageUrl,
    modifiers: modifiers || [] 
  });
  newItem.save()
    .then(() => res.status(201).json('Menu item added!'))
    .catch(err => {
        console.error("Error adding menu item:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json(`Validation Error: ${err.message}`);
        }
        res.status(500).json('Server Error');
    });
});

// --- 6. DELETE A MENU ITEM (ADMIN ONLY - PROTECTED) ---
// (Unchanged)
router.route('/:id').delete(auth, (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid Menu Item ID format');
    }
  MenuItem.findByIdAndDelete(req.params.id)
    .then(item => {
        if (!item) return res.status(404).json('Menu item not found.');
        res.json('Menu item deleted.')
    })
    .catch(err => {
        console.error("Error deleting menu item:", err);
        res.status(500).json('Server Error');
    });
});

// --- 7. UPDATE A MENU ITEM (ADMIN ONLY - UPDATED) ---
// (Unchanged - This route already accepts the imageUrl from the body)
router.route('/update/:id').patch(auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid Menu Item ID format');
    }
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json('Menu item not found.');
    }

    // Update simple fields
    if (req.body.name) item.name = req.body.name;
    if (req.body.price) item.price = Number(req.body.price);
    if (req.body.category) item.category = req.body.category;
    if (req.body.hasOwnProperty('inStock')) {
      item.inStock = req.body.inStock;
    }
    if (req.body.hasOwnProperty('imageUrl')) {
        item.imageUrl = req.body.imageUrl;
    }
    if (req.body.hasOwnProperty('isFeatured')) {
      item.isFeatured = req.body.isFeatured;
    }
    if (req.body.hasOwnProperty('modifiers')) {
        item.modifiers = req.body.modifiers;
    }

    await item.save();
    res.json('Menu item updated!');

  } catch (err) {
    console.error("Error updating menu item:", err);
    if (err.name === 'ValidationError') {
        return res.status(400).json(`Validation Error: ${err.message}`);
    }
    res.status(500).json('Server Error');
  }
});

// --- 8. (NEW) UPLOAD AN IMAGE (ADMIN ONLY) ---
// This route is protected by admin auth, and uses 'upload.single('image')'
// 'image' must match the FormData key from the frontend
router.post('/upload-image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ Error: 'No file uploaded.' });
    }
    
    // If upload is successful, req.file.path will contain the secure Cloudinary URL
    res.json({ imageUrl: req.file.path });

  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ Error: 'Image upload failed.', Details: err.message });
  }
});


module.exports = router;

