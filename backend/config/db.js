import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    dotenv.config({ path: '../.env' });
    dbUrl = process.env.DATABASE_URL;
}

if (!dbUrl) {
    console.error("DATABASE_URL is not defined in the environment variables.");
    process.exit(1);
}

const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false // Required for Neon PostgreSQL
    }
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Connected to Database successfully!');
    });
});

export default pool;
