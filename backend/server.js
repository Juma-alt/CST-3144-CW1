// server.js

// 1. IMPORT NECESSARY MODULES USING COMMONJS 'require'
const express = require("express");
const cors = require("cors");
// NOTE: dotenv require/config is now handled inside db.js for robust loading
const { connectDB } = require("./config/db"); 

// Import Route files
const orderRoutes = require("./routes/orders");
const activityRoutes = require("./routes/activities");

// The PORT variable is still loaded via db.js's dotenv call
const PORT = process.env.PORT || 3000; 

// 2. INITIALIZE APP & MIDDLEWARE
const app = express();

// Middleware for CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Middleware to parse JSON body
app.use(express.json());

// 3. API ROUTES
app.use("/api/orders", orderRoutes);
app.use("/api/activities", activityRoutes);

// 4. DATABASE CONNECTION & SERVER START
connectDB((err) => {
    if (err) {
        console.error('Failed to start server due to database error.');
        process.exit(1); 
        return;
    }

    // Only start the Express server if the database connection is successful
    app.listen(PORT, () => {
        // We log the connection status here after it succeeds in db.js
        console.log(`MongoDB Connected (Native Driver)`);
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});