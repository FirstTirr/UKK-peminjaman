const KategoriModel = require('../models/kategoriModel');
const db = require('../config/db');

const kategoriController = {
    async getAll(req, res) {
        try {
            const data = await KategoriModel.getAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const { nama_kategori } = req.body;
            const id = await KategoriModel.create(nama_kategori);
            
            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `TAMBAH KATEGORI: #${id}`, req.ip]);

            res.status(201).json({ message: 'Kategori berhasil ditambahkan', id_kategori: id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async update(req, res) {
        try {
            await KategoriModel.update(req.params.id, req.body.nama_kategori);
            res.json({ message: 'Kategori berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async remove(req, res) {
        try {
            await KategoriModel.delete(req.params.id);
            res.json({ message: 'Kategori berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = kategoriController;