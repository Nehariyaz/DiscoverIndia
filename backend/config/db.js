// db.js
const mongoose = require('mongoose');

let isConnected = false; // cached connection flag

const connectDB = async () => {
  if (isConnected) {
    // Return early if already connected to avoid reconnecting on warm Lambda
    return;
  }

  try {
    const uri = process.env.DB_URI;
    if (!uri) {
      throw new Error("Missing DB_URI in environment variables");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex, useFindAndModify no longer needed with new Mongoose versions
    });

    isConnected = true;
    console.log(`MongoDB connected to ${uri}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err; // Let the caller decide how to handle this
  }
};

module.exports = connectDB;
