const express = require('express');
const cors = require('cors');
const helmet = require('helmet');  
const connectDB = require('./config/db');
// API
const authRoutes = require('./routes/auth');
const mealsRoutes = require('./routes/meal.routes');
const profileRoutes = require('./routes/profile.routes');

const rateLimit = require('express-rate-limit');

const app = express();

require('dotenv').config();

connectDB();

app.use(cors()); // to allow diff reqests  form ports

app.use(helmet()); // for security 

app.use(express.json()); // to parse json respons

//express framework makes it easier to build web servers and APIs.

// // Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 time
  message: "Too many requests, try again later",
  skip: (req) => req.ip === "127.0.0.1", 
});
// app.use("/api/auth", limiter);

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth',authRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/profile', profileRoutes);

module.exports = app;