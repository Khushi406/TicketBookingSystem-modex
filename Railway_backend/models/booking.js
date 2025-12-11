const pool = require('../config/db');

async function listSeats(showId) {
  const res = await pool.query(
    `SELECT id, seat_number, booked, booking_id
     FROM seats
     WHERE show_id = $1
     ORDER BY seat_number ASC`,
    [showId]
  );
  return res.rows;
}

async function createBooking({ show_id, user_email, seat_numbers }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create booking in PENDING
    const bookingRes = await client.query(
      `INSERT INTO bookings (show_id, user_email, seat_numbers, status)
       VALUES ($1, $2, $3, 'PENDING')
       RETURNING id, status`,
      [show_id, user_email, seat_numbers]
    );
    const booking = bookingRes.rows[0];

    // Lock targeted seats
    const seatsRes = await client.query(
      `
      SELECT id, seat_number, booked, booking_id
      FROM seats
      WHERE show_id = $1 AND seat_number = ANY($2::int[])
      FOR UPDATE
      `,
      [show_id, seat_numbers]
    );
    const seats = seatsRes.rows;

    // Validate all requested seats fetched
    const foundSeatNumbers = new Set(seats.map(s => s.seat_number));
    const missing = seat_numbers.filter(n => !foundSeatNumbers.has(n));
    if (missing.length > 0) {
      // Seats not present; fail booking
      await client.query(
        `UPDATE bookings SET status = 'FAILED' WHERE id = $1`,
        [booking.id]
      );
      await client.query('COMMIT');
      return { ...booking, status: 'FAILED', reason: 'Invalid seat numbers', missing };
    }

    // Check availability
    const unavailable = seats.filter(s => s.booked);
    if (unavailable.length > 0) {
      await client.query(
        `UPDATE bookings SET status = 'FAILED' WHERE id = $1`,
        [booking.id]
      );
      await client.query('COMMIT');
      return {
        ...booking,
        status: 'FAILED',
        reason: 'Some seats already booked',
        conflictSeats: unavailable.map(s => s.seat_number),
      };
    }

    // Mark seats as booked and link to booking
    const seatIds = seats.map(s => s.id);
    if (seatIds.length > 0) {
      await client.query(
        `UPDATE seats SET booked = TRUE, booking_id = $1 WHERE id = ANY($2::int[])`,
        [booking.id, seatIds]
      );
    }

    // Confirm booking
    const confirmRes = await client.query(
      `UPDATE bookings SET status = 'CONFIRMED'
       WHERE id = $1
       RETURNING id, status`,
      [booking.id]
    );

    await client.query('COMMIT');
    return { ...confirmRes.rows[0], seat_numbers };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getBooking(id) {
  const res = await pool.query(
    `SELECT id, show_id, user_email, seat_numbers, status, created_at
     FROM bookings WHERE id = $1`,
    [id]
  );
  return res.rows[0] || null;
}

module.exports = { createBooking, listSeats, getBooking };