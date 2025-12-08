const express = require("express");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs"); 
const { connectDB } = require("./config/db"); 

const orderRoutes = require("./routes/orders");
const activityRoutes = require("./routes/activities");

const PORT = process.env.PORT || 3000; 
const app = express();

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to: ${req.url}`);
    next(); 
});

app.use(cors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json());


app.get("/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'public', 'images', filename);

    // To check if the file exists on the server
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        // will return an error message if the image file does not exist
        res.status(404).json({ error: "Image file not found" });
    }
});

// API ROUTES
app.use("/api/orders", orderRoutes);
app.use("/api/activities", activityRoutes);

// DATABASE CONNECTION & SERVER START
connectDB((err) => {
    if (err) {
        console.error("Database failed to connect:", err);
        process.exit(1);
    }

    
    app.listen(PORT, '0.0.0.0', () => { 
        console.log(`MongoDB Connected (Native Driver)`);
        console.log(`✅ Server running on port ${PORT}`);
    });
});