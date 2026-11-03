const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// Sesuai matriks UKK: Petugas & Admin dapat mencetak/melihat laporan
router.get('/read', verifyToken, restrictTo('admin', 'petugas'), laporanController.read);
router.get('/pengembalian', verifyToken, restrictTo('admin', 'petugas'), laporanController.pengembalian);

module.exports = router;
