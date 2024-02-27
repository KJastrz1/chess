const mongoose = require('mongoose');
require('dotenv').config(); 

const mongoURI = process.env.MONGO_CONNECTION_STRING; 

const connectDB = async () => { 
  try {
    await mongoose.connect(mongoURI);
    console.log(`MongoDB connected`);
  
  } catch (err) {
    console.error(err.message);   
    process.exit(1);
  }
};

module.exports = connectDB;