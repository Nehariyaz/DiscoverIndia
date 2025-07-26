const mongoose = require('mongoose');

/**
 * Call before/after each test suite to clear key collections.
 */
module.exports = async function cleanupDB() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
};
