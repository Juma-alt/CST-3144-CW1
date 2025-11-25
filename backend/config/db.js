// backend/config/db.js

// 🛑 FIX: Load dotenv here to ensure MONGO_URI is always defined 
const dotenv = require("dotenv");
dotenv.config();
// ------------------------------------------

// 1. Use require for CommonJS consistency
const { MongoClient } = require("mongodb");

// 2. Load URI from the secure environment variables
const uri = process.env.MONGO_URI; 

// Initialize the client outside the function
const client = new MongoClient(uri);

let db;

async function connectDB(callback) {
  // Add a check for the URI just in case
  if (!uri) {
    console.error("CRITICAL: MONGO_URI is missing. Check your .env file.");
    // In server.js, this will cause the server to exit(1)
    return callback(new Error("MONGO_URI not configured."));
  }
  
  if (!db) {
    try {
      await client.connect();
      // Use your chosen database name
      db = client.db("CST3144_CW1"); // Make sure this matches your Compass database name
      console.log("MongoDB Connection Established.");
      callback(); // Call the callback function upon success
    } catch (err) {
      console.error("MongoDB Connection Error:", err.message);
      callback(err); // Pass the error to the callback
    }
  }
}

// Function to retrieve the connected database instance
function getDb() {
  return db;
}

module.exports = {
  connectDB,
  getDb,
};