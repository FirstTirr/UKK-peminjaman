const AlatModel = require('../models/alatModel');
const db = require('../config/db');

const alatController = {
    async getAll(req, res) {
        try {
            const data = await AlatModel.getAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const id = await AlatModel.create(req.body);
            
            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `TAMBAH ALAT: #${id}`, req.ip]);

            res.status(201).json({ message: 'Alat berhasil ditambahkan', id_alat: id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async update(req, res) {
        try {
            await AlatModel.update(req.params.id, req.body);
            res.json({ message: 'Alat berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async remove(req, res) {
        try {
            await AlatModel.softDelete(req.params.id);
            res.json({ message: 'Alat berhasil dihapus (soft delete)' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = alatController;