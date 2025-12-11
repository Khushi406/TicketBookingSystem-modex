const { createShow, listShows, deleteShow } = require('../models/show');

exports.createShow = async (req, res) => {
  try {
    const { name, start_time, total_seats } = req.body;
    if (!name || !start_time || !total_seats) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const seats = Number(total_seats);
    if (!Number.isFinite(seats) || seats <= 0) {
      return res.status(400).json({ error: 'total_seats must be a positive number' });
    }
    const show = await createShow({
      name,
      start_time: new Date(start_time),
      total_seats: seats,
    });
    res.status(201).json(show);
  } catch (err) {
    console.error('createShow error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getShows = async (_req, res) => {
  try {
    const shows = await listShows();
    res.json(shows);
  } catch (err) {
    console.error('getShows error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid show ID' });
    }
    const deleted = await deleteShow(Number(id));
    if (!deleted) {
      return res.status(404).json({ error: 'Show not found' });
    }
    res.json({ message: `Show "${deleted.name}" deleted successfully`, id: deleted.id });
  } catch (err) {
    console.error('deleteShow error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};