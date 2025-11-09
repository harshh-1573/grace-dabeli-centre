const router = require('express').Router();
let Order = require('../models/order.model');
const auth = require('../middleware/auth.middleware');

// --- GET ANALYTICS STATS (UPGRADED WITH PIE CHART DATA) ---
router.route('/').get(auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let matchCondition = {};

    // 1. Build the Date Filter (same as before)
    if (startDate || endDate) {
      matchCondition.createdAt = {};
      
      if (startDate) {
        matchCondition.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        let finalEndDate = new Date(endDate);
        finalEndDate.setDate(finalEndDate.getDate() + 1); // Go to the end of the day
        matchCondition.createdAt.$lt = finalEndDate;
      }
    }
    
    // --- Aggregation Pipeline: Use $facet to run multiple queries at once ---
    const aggregationPipeline = [
      { $match: matchCondition }, // Apply date filter first
      {
        $facet: {
          // --- Pipeline A: Calculate Totals ---
          "totals": [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalCompletedOrders: {
                  $sum: { $cond: [ { $eq: ["$status", "Completed"] }, 1, 0 ] }
                },
                totalCancelledOrders: {
                  $sum: { $cond: [ { $eq: ["$status", "Cancelled"] }, 1, 0 ] }
                },
                totalSales: {
                  $sum: { $cond: [ { $eq: ["$status", "Completed"] }, "$totalPrice", 0 ] }
                }
              }
            }
          ],
          
          // --- Pipeline B: Calculate Top Items (Completed Orders Only) ---
          "topItems": [
            { $match: { status: "Completed" } }, // Only count sales from completed orders
            { $unwind: "$items" }, 
            {
              $group: {
                _id: "$items.name",
                quantity: { $sum: "$items.quantity" }
              }
            },
            { $sort: { quantity: -1 } }, 
            { $limit: 5 }, // Get Top 5
            { 
              $project: { // Rename _id to name for recharts
                name: "$_id",
                quantity: 1,
                _id: 0
              }
            }
          ],

          // --- Pipeline C: Calculate Status Breakdown (for Pie Chart) ---
          "statusBreakdown": [
            {
              $group: {
                _id: "$status",
                value: { $sum: 1 } // 'value' is a good key for recharts
              }
            },
            {
              $project: { // Rename _id to name for recharts
                name: "$_id",
                value: 1,
                _id: 0
              }
            }
          ]
        }
      }
    ];

    // 3. Execute the single, powerful query
    const results = await Order.aggregate(aggregationPipeline);

    // 4. Format the results
    const totalsData = results[0].totals[0] || {}; // Get first item or empty object
    const topItemsData = results[0].topItems;
    const statusBreakdownData = results[0].statusBreakdown;

    // Calculate AOV (Average Order Value)
    const averageOrderValue = totalsData.totalCompletedOrders > 0
      ? totalsData.totalSales / totalsData.totalCompletedOrders
      : 0;

    // 5. Combine and Send Final Stats
    const finalStats = {
      totalOrders: totalsData.totalOrders || 0,
      totalSales: totalsData.totalSales || 0,
      totalCompletedOrders: totalsData.totalCompletedOrders || 0,
      totalCancelledOrders: totalsData.totalCancelledOrders || 0,
      averageOrderValue: averageOrderValue,
      topItems: topItemsData,
      statusBreakdown: statusBreakdownData
    };
    
    res.json(finalStats);

  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json('Server Error fetching analytics');
  }
});

module.exports = router;

