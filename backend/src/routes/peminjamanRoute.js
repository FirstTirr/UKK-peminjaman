const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// Lihat daftar peminjaman (Admin & Petugas)
router.get('/read', verifyToken, restrictTo('admin', 'petugas'), peminjamanController.read);

// Peminjam mengajukan peminjaman alat
router.post('/', verifyToken, restrictTo('peminjam'), peminjamanController.create);

// Petugas/Admin mengubah status peminjaman (Menunggu -> Disetujui / Dipinjam / Ditolak)
router.put('/edit/status/:id', verifyToken, restrictTo('admin', 'petugas'), peminjamanController.editStatus);

// Pengembalian alat (memanggil Stored Procedure sp_kembalikan_alat)
router.post('/kembalikan/:id', verifyToken, restrictTo('admin', 'petugas'), peminjamanController.kembalikanAlat);

module.exports = router;