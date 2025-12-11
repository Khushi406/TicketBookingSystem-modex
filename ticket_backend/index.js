require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { startExpiryJob } = require('./jobs/expirePending');
startExpiryJob();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Import routes (add these files later)
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Use routes
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Ticket Booking System API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});