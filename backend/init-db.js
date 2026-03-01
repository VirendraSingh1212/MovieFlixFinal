import pool from './config/db.js';

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      uid SERIAL PRIMARY KEY,
      uname VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'USER',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('Users table created successfully (or already exists).');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    pool.end();
  }
};

createTable();
