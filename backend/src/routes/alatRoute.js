const express = require('express');
const router = express.Router();
const alatController = require('../controllers/alatController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// Siapa saja (termasuk peminjam) bisa melihat daftar alat sesuai matriks UKK
router.get('/', alatController.getAll);

// Hanya Admin yang bisa mengelola (CRUD) alat
router.post('/', verifyToken, restrictTo('admin'), alatController.create);
router.put('/:id', verifyToken, restrictTo('admin'), alatController.update);
router.delete('/:id', verifyToken, restrictTo('admin'), alatController.remove);

module.exports = router;