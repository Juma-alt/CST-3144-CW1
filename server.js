const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db"); 

// Import Route files
const orderRoutes = require("./routes/orders");
const activityRoutes = require("./routes/activities");


const PORT = process.env.PORT || 3000; 

const app = express();

app.use(cors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.json());

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