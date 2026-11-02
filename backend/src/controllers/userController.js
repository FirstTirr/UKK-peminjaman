const UserService = require('../services/userService');
const db = require('../config/db');

const userController = {
    async getAll(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const id = await UserService.createUser(req.body);
            
            // Catat Log Aktivitas (Admin action)
            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `TAMBAH USER: #${id}`, req.ip]);

            res.status(201).json({ message: 'User berhasil ditambahkan', id_user: id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async update(req, res) {
        try {
            await UserService.updateUser(req.params.id, req.body);
            
            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `UPDATE USER: #${req.params.id}`, req.ip]);

            res.json({ message: 'User berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async remove(req, res) {
        try {
            await UserService.deleteUser(req.params.id);
            
            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `HAPUS USER: #${req.params.id}`, req.ip]);

            res.json({ message: 'User berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;