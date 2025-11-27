const express = require('express');
const { getDb } = require('../config/db'); 

const router = express.Router();

// GET all activities from the 'activities' collection
router.get("/", async (req, res) => {
    try {
   
        const db = getDb(); 

        const activities = await db.collection("activities")
            .find({}, { projection: { _id: 1, subject: 1, location: 1, price: 1, stock: 1, icon: 1 } })
            .toArray();
        
        res.status(200).json(activities);
    } catch (err) {
        console.error("Error fetching activities:", err);

        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

// Export using CommonJS syntax
module.exports = router;