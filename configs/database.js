const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/daily_update_db";
    // Use 127.0.0.1 instead of localhost for Node.js 18+ to avoid IPv6 issues.
    // 'daily_update_db' is the name of your database. MongoDB will create it if it doesn't exist.

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
