const PeminjamanModel = require('../models/peminjamanModel');
const PeminjamanService = require('../services/peminjamanService');
const db = require('../config/db');

const peminjamanController = {
    async read(req, res) {
        try {
            const id_user = req.user.role === 'peminjam' ? req.user.id_user : null;
            const data = await PeminjamanModel.getAll(id_user);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const id_peminjaman = await PeminjamanService.ajukanPeminjaman(req.user.id_user, req.body);
            
            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `AJUKAN PEMINJAMAN: #${id_peminjaman}`, req.ip]);

            res.status(201).json({ message: 'Pengajuan peminjaman berhasil', id_peminjaman });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async editStatus(req, res) {
        try {
            const { status } = req.body; // 'Disetujui', 'Dipinjam', 'Ditolak'
            const id_petugas = req.user.id_user;

            await PeminjamanModel.updateStatus(req.params.id, status, id_petugas);

            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `UPDATE STATUS PEMINJAMAN #${req.params.id} -> ${status}`, req.ip]);

            res.json({ message: `Status peminjaman berhasil diubah menjadi ${status}` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async kembalikanAlat(req, res) {
        try {
            const { tgl_kembali_sebenarnya, tarif_denda } = req.body;
            
            await PeminjamanModel.callKembalikanSP(req.params.id, tgl_kembali_sebenarnya, tarif_denda || 10000);

            await db.query('INSERT INTO log_aktivitas (id_user, aktivitas, ip_address) VALUES (?, ?, ?)',
                [req.user.id_user, `PENGEMBALIAN ALAT PEMINJAMAN #${req.params.id}`, req.ip]);

            res.json({ message: 'Alat berhasil dikembalikan dan denda dihitung otomatis' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = peminjamanController;
