// routes/activities.js (Corrected)

const express = require('express');
const { getDb } = require('../config/db'); // 1. Use require() and getDb

const router = express.Router();

// GET all activities from the 'activities' collection
router.get("/", async (req, res) => {
    try {
        // 2. Access the already connected DB instance synchronously
        const db = getDb(); 
        
        // Find all activities, excluding the _id from the returned data (optional, but clean)
        const activities = await db.collection("activities")
            .find({}, { projection: { _id: 1, subject: 1, location: 1, price: 1, stock: 1, icon: 1 } })
            .toArray();
        
        res.status(200).json(activities);
    } catch (err) {
        console.error("Error fetching activities:", err);
        // Important: Use 500 for server-side errors
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

// 3. Export using CommonJS syntax
module.exports = router;