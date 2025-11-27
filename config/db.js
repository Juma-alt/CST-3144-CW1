// db.js

const { MongoClient } = require("mongodb");


const uri = "mongodb+srv://juma_ghanim:Juma%402005@cluster0.xbfprdc.mongodb.net/"; 

const client = new MongoClient(uri);

let db;

async function connectDB(callback) {
  if (!uri) {
 
    console.error("CRITICAL: MONGO_URI is missing. Check your Render Environment Variables.");
    return callback(new Error("MONGO_URI not configured."));
  }
  
  if (!db) {
    try {
      await client.connect();
     
      db = client.db("CST3144_CW1"); 
      console.log("MongoDB Connection Established.");
      callback(); 
    } catch (err) {
      console.error("MongoDB Connection Error:", err.message);
      callback(err); 
    }
  }
}


function getDb() {
  return db;
}

module.exports = {
  connectDB,
  getDb,
};