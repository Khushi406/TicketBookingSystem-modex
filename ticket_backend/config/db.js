const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Add DATABASE_URL to your .env file
  // ssl: { rejectUnauthorized: false } // Uncomment if using a cloud DB with SSL
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

module.exports = pool;