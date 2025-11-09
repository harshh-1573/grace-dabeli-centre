const router = require('express').Router();
let Feedback = require('../models/feedback.model');
const auth = require('../middleware/auth.middleware'); // Admin guard

// --- 1. ADD NEW FEEDBACK (PUBLIC - UPDATED) ---
// This route is public. Anyone can post feedback.
router.route('/add').post(async (req, res) => {
  // FIX: Added 'rating' to destructuring
  const { name, contact, rating, message } = req.body; 

  // FIX: Added validation for rating
  if (!name || !message || rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json('Error: Name, rating (1-5), and message are required.');
  }

  try {
    // FIX: Included rating in the new Feedback object
    const newFeedback = new Feedback({ 
      name, 
      contact, 
      rating: Number(rating), // Ensure rating is a number
      message 
    });
    
    await newFeedback.save();
    
    res.status(201).json('Feedback submitted successfully!');

  } catch (err) {
    console.error("Error adding feedback:", err);
    res.status(400).json('Error: ' + err);
  }
});


// ===========================================
// 2️⃣ (NEW) GET PUBLIC RATING STATS AND REVIEWS
// ===========================================
router.route('/public').get(async (req, res) => {
    try {
        // Only count and fetch reviews that the admin has marked as public
        const matchCondition = { isPublic: true };

        // 1. Calculate Average Rating and Count
        const statsPipeline = [
            { $match: matchCondition },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ];

        const statsResult = await Feedback.aggregate(statsPipeline);

        const averageRating = statsResult[0]?.averageRating || 0;
        const totalReviews = statsResult[0]?.totalReviews || 0;

        // 2. Fetch Top 3 Testimonials
        const topReviews = await Feedback.find(matchCondition)
            .sort({ createdAt: -1, rating: -1 }) // Sort by newest and highest rating
            .limit(3)
            .select('name rating message createdAt');

        res.json({
            stats: {
                averageRating: parseFloat(averageRating.toFixed(1)),
                totalReviews
            },
            testimonials: topReviews
        });

    } catch (err) {
        console.error("Error fetching public feedback:", err);
        res.status(500).json('Server Error fetching public feedback.');
    }
});
// ===========================================


// --- 3. GET ALL FEEDBACK (ADMIN ONLY - Unchanged) ---
router.route('/').get(auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json('Server Error: ' + err);
  }
});

// ===========================================
// 4️⃣ (NEW) UPDATE PUBLIC STATUS (ADMIN ONLY)
// ===========================================
router.route('/public/:id').patch(auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json('Feedback not found');
    }

    // Allow setting isPublic
    if (req.body.hasOwnProperty('isPublic')) {
        feedback.isPublic = req.body.isPublic;
    }
    
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json('Server Error: ' + err);
  }
});


// --- 5. MARK FEEDBACK AS "READ" (ADMIN ONLY - UPDATED) ---
router.route('/read/:id').patch(auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json('Feedback not found');
    }

    // Allow toggling read status
    if (req.body.hasOwnProperty('isRead')) {
      feedback.isRead = req.body.isRead;
    } else {
      // Fallback: toggle if isRead status isn't explicitly provided (old way)
      feedback.isRead = !feedback.isRead;
    }

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json('Server Error: ' + err);
  }
});

module.exports = router;
