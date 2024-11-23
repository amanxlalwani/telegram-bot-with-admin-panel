const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); 

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the application if the connection fails
  }
};

module.exports = { connect };