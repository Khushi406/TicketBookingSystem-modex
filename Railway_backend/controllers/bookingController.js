const { createBooking, listSeats, getBooking } = require('../models/booking');

exports.getSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const seats = await listSeats(Number(showId));
    res.json(seats);
  } catch (err) {
    console.error('getSeats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { show_id, user_email, seat_numbers } = req.body;
    if (!show_id || !user_email || !Array.isArray(seat_numbers) || seat_numbers.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or invalid seat_numbers' });
    }
    const result = await createBooking({
      show_id: Number(show_id),
      user_email,
      seat_numbers: seat_numbers.map(Number),
    });
    res.status(result.status === 'CONFIRMED' ? 201 : 409).json(result);
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await getBooking(Number(id));
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error('getBooking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};