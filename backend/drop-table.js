import pool from './config/db.js';

const dropTable = async () => {
    try {
        await pool.query('DROP TABLE IF EXISTS users CASCADE');
        console.log("Table dropped");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
};

dropTable();
