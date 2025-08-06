const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) { // Check if not already connected
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected successfully.');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Do not exit process in test environment
  }
};

// Call connectDB when the server starts
connectDB();

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Define Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/analytics', require('./routes/analytics'));

// Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;