const express = require("express");
const cors = require("cors");
const path = require("path"); // Added to handle file paths
const fs = require("fs"); // Added to check if files exist
const { connectDB } = require("./config/db"); 

const orderRoutes = require("./routes/orders");
const activityRoutes = require("./routes/activities");

const PORT = process.env.PORT || 3000; 
const app = express();

// ==========================================
// A. LOGGER MIDDLEWARE (Requirement 4%)
// ==========================================
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to: ${req.url}`);
    next(); // Pass control to the next middleware
});

app.use(cors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json());

// ==========================================
// B. STATIC FILE MIDDLEWARE (Requirement 4%)
// ==========================================
app.get("/images/:filename", (req, res) => {
    const filename = req.params.filename;
    // Assuming your images are stored in a folder called "public/images"
    const imagePath = path.join(__dirname, 'public', 'images', filename);

    // Check if the file exists on the server
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        // Return an error message if the image file does not exist
        res.status(404).json({ error: "Image file not found" });
    }
});

// API ROUTES
app.use("/api/orders", orderRoutes);
app.use("/api/activities", activityRoutes);

// DATABASE CONNECTION & SERVER START
connectDB((err) => {
    if (err) {
        console.error('Failed to start server due to database error.');
        process.exit(1); 
        return;
    }
    
    app.listen(PORT, '0.0.0.0', () => { 
        console.log(`MongoDB Connected (Native Driver)`);
        console.log(`✅ Server running on port ${PORT}`);
    });
});