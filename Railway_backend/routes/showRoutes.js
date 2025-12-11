const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');

// Admin: create show/trip/slot
router.post('/', showController.createShow);

// User/Admin: list shows/trips/slots
router.get('/', showController.getShows);

module.exports = router;