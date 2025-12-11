const pool = require('../config/db');

async function createShow({ name, start_time, total_seats }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create show
    const showRes = await client.query(
      `INSERT INTO shows (name, start_time, total_seats)
       VALUES ($1, $2, $3)
       RETURNING id, name, start_time, total_seats`,
      [name, start_time, total_seats]
    );
    const show = showRes.rows[0];

    // Ensure seats table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
        seat_number INTEGER NOT NULL,
        booking_id INTEGER REFERENCES bookings(id),
        booked BOOLEAN DEFAULT FALSE,
        UNIQUE (show_id, seat_number)
      );
    `);

    // Seed seats 1..total_seats
    const values = [];
    for (let i = 1; i <= total_seats; i++) values.push(`(${show.id}, ${i})`);
    if (values.length > 0) {
      await client.query(`
        INSERT INTO seats (show_id, seat_number)
        VALUES ${values.join(',')}
        ON CONFLICT (show_id, seat_number) DO NOTHING
      `);
    }

    await client.query('COMMIT');
    return show;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function listShows() {
  const res = await pool.query(
    `SELECT id, name, start_time, total_seats, created_at
     FROM shows
     ORDER BY start_time ASC`
  );
  return res.rows;
}

async function deleteShow(showId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Delete associated bookings first
    await client.query('DELETE FROM bookings WHERE show_id = $1', [showId]);
    
    // Delete seats (should cascade, but being explicit)
    await client.query('DELETE FROM seats WHERE show_id = $1', [showId]);
    
    // Delete the show
    const result = await client.query(
      'DELETE FROM shows WHERE id = $1 RETURNING id, name',
      [showId]
    );
    
    await client.query('COMMIT');
    
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { createShow, listShows, deleteShow };