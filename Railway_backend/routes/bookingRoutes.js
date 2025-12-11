const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// List seats for a show/trip
router.get('/seats/:showId', bookingController.getSeats);

// Create booking
router.post('/', bookingController.createBooking);

// Get booking status by id
router.get('/:id', bookingController.getBooking);

module.exports = router;