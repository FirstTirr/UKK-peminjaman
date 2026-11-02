const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authController = {
    async register(req, res) {
        try {
            const { username, password, role, no_hp, alamat } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userRole = role || 'peminjam';

            const id = await UserModel.create({
                username,
                password_hash: hashedPassword,
                role: userRole,
                no_hp,
                alamat
            });

            res.status(201).json({ message: 'Registrasi berhasil', id_user: id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await UserModel.findByUsername(username);

            if (!user) return res.status(401).json({ message: 'Username atau password salah' });

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) return res.status(401).json({ message: 'Username atau password salah' });

            const token = jwt.sign(
                { id_user: user.id_user, username: user.username, role: user.role },
                process.env.JWT_SECRET || 'rahasia_ukksmk',
                { expiresIn: '1d' }
            );

            res.json({ message: 'Login berhasil', token, role: user.role });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;