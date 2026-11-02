const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/tambah-petugas', verifyToken, restrictTo('admin'), authController.register);

module.exports = router;