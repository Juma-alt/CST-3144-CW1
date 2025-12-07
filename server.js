const express = require("express");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs"); 
const { connectDB } = require("./config/db"); 

const orderRoutes = require("./routes/orders");
const activityRoutes = require("./routes/activities");

const PORT = process.env.PORT || 3000; 
const app = express();

// ==========================================
// A. LOGGER MIDDLEWARE (Requirement 4%)
// ==========================================
// Records traffic to the console for inspection
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`-----------------------------------`);
    console.log(`[${timestamp}] New Request Received:`);
    console.log(`Method: ${req.method} | URL: ${req.url}`);
    console.log(`-----------------------------------`);
    next(); 
});

app.use(cors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json());

// ==========================================
// CHALLENGE: FULL-TEXT SEARCH (Matches Vue Frontend)
// ==========================================
// This handles the dynamic "movement" by filtering the collection
app.get("/api/search", (req, res) => {
    const query = req.query.q; 
    // "i" makes it case-insensitive so 'C' matches 'creative'
    const searchRegex = new RegExp(query, "i"); 

    const searchCriteria = {
        $or: [
            { subject: searchRegex },    // Matches "Creative Writing" when user types 'C'
            { location: searchRegex },
            { availability: searchRegex }
        ]
    };

    // Performs search on the lessons collection
    app.locals.db.collection('lessons').find(searchCriteria).toArray((err, results) => {
        if (err) {
            console.error("Search failed:", err);
            res.status(500).json({ error: "Internal server error during search" });
        } else {
            // Returns ONLY matched items, causing other cards to disappear
            res.json(results);
        }
    });
});

// ==========================================
// B. STATIC FILE MIDDLEWARE (Requirement 4%)
// ==========================================
app.get("/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'public', 'images', filename);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: "Image file not found" });
    }
});

// API ROUTES
app.use("/api/orders", orderRoutes);
app.use("/api/activities", activityRoutes);

// DATABASE CONNECTION & SERVER START
connectDB((err, database) => {
    if (err) {
        console.error('Failed to start server due to database error.');
        process.exit(1); 
        return;
    }
    
    app.locals.db = database;
    
    app.listen(PORT, '0.0.0.0', () => { 
        console.log(`✅ Server running on port ${PORT}`);
    });
});
