const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DB_URI;

    if (!uri) {
      throw new Error("Missing DB_URI in environment variables");
    }

   await mongoose.connect(uri);


    console.log(`MongoDB connected to ${uri}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
