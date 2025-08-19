/**
 * @description: Database connection configuration
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const db = process.env.MONGO_URI; 

const connectDB = async () => {
    try {
        //  async
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 20, 
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

/**
 * this option for better performance
useNewUrlParser: true: Uses the new MongoDB connection string parser for better compatibility. old is has problem with special caracter

useUnifiedTopology: true: Uses a new engine in (MongoDB driver) that handles connections more efficiently and fixes bugs in older versions

maxPoolSize: 20: Controls how many requests can talk to MongoDB at once. (20)
 */