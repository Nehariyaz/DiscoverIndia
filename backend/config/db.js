// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  // readyState 1 = connected. Reusing the connection keeps warm Lambda
  // invocations fast, and (unlike a manual flag) it stays correct if the
  // connection is closed or dropped.
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const uri = process.env.DB_URI;
    if (!uri) {
      throw new Error("Missing DB_URI in environment variables");
    }

    await mongoose.connect(uri);

    // Never log the URI: it contains the database password.
    console.log("MongoDB connected");
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err; // Let the caller decide how to handle this
  }
};

module.exports = connectDB;