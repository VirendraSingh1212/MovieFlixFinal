import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token without password
            const result = await pool.query('SELECT id, username, email, phone_number, created_at FROM users WHERE id = $1', [decoded.id]);

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = result.rows[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {

    }
};
