const pool = require('../config/db');

async function expirePendingBookings() {
  try {
    await pool.query(`
      UPDATE bookings
      SET status = 'FAILED'
      WHERE status = 'PENDING'
        AND created_at < NOW() - INTERVAL '2 minutes'
    `);
  } catch (err) {
    console.error('expirePendingBookings error:', err);
  }
}

function startExpiryJob() {
  setInterval(expirePendingBookings, 30 * 1000); // every 30s
}

module.exports = { startExpiryJob };