const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// Sesuai matriks UKK: Hanya Admin yang boleh membaca Log Aktivitas
router.get('/read', verifyToken, restrictTo('admin'), logController.read);

module.exports = router;