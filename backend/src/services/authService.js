// src/services/authService.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_ukksmk';

async function login(username, password, ipAddress) {
    const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
    if (rows.length === 0) {
        throw new Error('Username atau password salah');
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Username atau password salah');
    }

    const token = jwt.sign(
        { id_user: user.id_user, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Catat log aktivitas login
    await db.query(
        'INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
        [user.id_user, `LOGIN: ${user.role} ${user.username}`, ipAddress]
    );

    return {
        token,
        user: {
            id_user: user.id_user,
            username: user.username,
            role: user.role
        }
    };
}

async function register(data) {
    const { username, password, no_hp, alamat } = data;
    if (!username || !password || !no_hp || !alamat) {
        throw new Error('Semua kolom wajib diisi (username, password, no_hp, alamat)');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const [result] = await db.query(
            'INSERT INTO user (username, password_hash, role, no_hp, alamat) VALUES (?, ?, "peminjam", ?, ?)',
            [username, hashedPassword, no_hp, alamat]
        );
        return { id_user: result.insertId };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Username sudah digunakan');
        }
        throw error;
    }
}

module.exports = {
    login,
    register
};