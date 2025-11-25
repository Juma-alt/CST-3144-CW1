// routes/orders.js

const express = require('express');
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb'); 

const router = express.Router();

// 🛒 POST /api/orders - CREATE ORDER and UPDATE STOCK
router.post("/", async (req, res) => {
    const orderData = req.body; 
    
    try {
        const db = getDb(); 
        
        if (!orderData.items || orderData.items.length === 0) {
            return res.status(400).json({ message: "No activities selected for this order." });
        }
        
        // --- STEP 1: ENRICHMENT & VALIDATION ---
        const itemIds = orderData.items.map(item => new ObjectId(item.id));
        
        // Fetch the full details of all ordered activities in one query
        const activitiesDetails = await db.collection('activities')
            .find({ _id: { $in: itemIds } })
            .toArray();

        if (activitiesDetails.length !== itemIds.length) {
            return res.status(400).json({ message: "One or more activities were not found." });
        }

        // Create the final items list for the order document, combining quantity and details
        const finalItems = orderData.items.map(orderItem => {
            const detail = activitiesDetails.find(d => d._id.toString() === orderItem.id);
            if (!detail) {
                // This shouldn't happen if validation above passed, but good for safety
                throw new Error(`Details missing for ID: ${orderItem.id}`);
            }
            return {
                id: orderItem.id,
                subject: detail.subject,      // <-- ADDED NAME
                location: detail.location,    // <-- ADDED LOCATION
                price: detail.price,          // <-- ADDED PRICE
                quantity: orderItem.quantity,
            };
        });

        // --- STEP 2: UPDATE STOCK ---
        const updatePromises = finalItems.map(item => 
            db.collection('activities').updateOne(
                { 
                    _id: new ObjectId(item.id),
                    stock: { $gte: item.quantity } 
                },
                { 
                    $inc: { stock: -item.quantity } 
                }
            )
        );

        const updateResults = await Promise.all(updatePromises);
        const failedUpdates = updateResults.filter(r => r.modifiedCount !== 1);
        if (failedUpdates.length > 0) {
             return res.status(400).json({ message: "Stock is too low for one or more activities. Order cancelled." });
        }

        // --- STEP 3: Save the Order with ENRICHED items ---
        const orderResult = await db.collection("orders").insertOne({
            student: orderData.student,
            items: finalItems, // <-- USING THE ENRICHED ARRAY HERE
            totalPrice: orderData.totalPrice,
            createdAt: new Date()
        });
        
        // Success Response
        res.status(201).json({
            success: true,
            orderId: orderResult.insertedId,
            message: "Order placed and stock updated successfully."
        });

    } catch (err) {
        console.error("Error in POST /api/orders:", err);
        res.status(500).json({ error: "Failed to process order. Check server logs." });
    }
});

// GET /api/orders - GET ALL ORDERS (Optional)
router.get("/", async (req, res) => {
    try {
        const db = getDb();
        const orders = await db.collection("orders").find().toArray();
        res.status(200).json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

module.exports = router;