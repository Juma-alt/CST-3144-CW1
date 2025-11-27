const dotenv = require("dotenv");
dotenv.config();
// ------------------------------------------


const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; 

const client = new MongoClient(uri);

let db;

async function connectDB(callback) {
  if (!uri) {
    console.error("CRITICAL: MONGO_URI is missing. Check your .env file.");
    // In server.js, this will cause the server to exit(1)
    return callback(new Error("MONGO_URI not configured."));
  }
  
  if (!db) {
    try {
      await client.connect();
      // Use your chosen database name
      db = client.db("CST3144_CW1"); 
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