import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (req, res) => {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const userExistsResult = await pool.query('SELECT * FROM users WHERE email = $1 OR uname = $2', [email, username]);
        if (userExistsResult.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertResult = await pool.query(
            'INSERT INTO users (uname, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING uid, uname, email, phone, role',
            [username, email, phone, hashedPassword, 'USER']
        );

        res.status(201).json({
            message: 'Register success',
            uid: insertResult.rows[0].uid,
            uname: insertResult.rows[0].uname,
            email: insertResult.rows[0].email,
            phone: insertResult.rows[0].phone,
            role: insertResult.rows[0].role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE uname = $1', [username]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { sub: user.uname, role: user.role || 'USER' },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '7d', algorithm: 'HS256' }
            );

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                message: 'Login successful',
                uid: user.uid,
                uname: user.uname,
                email: user.email,
                phone: user.phone,
                role: user.role || 'USER'
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getProfile = async (req, res) => {
    res.status(200).json(req.user);
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
