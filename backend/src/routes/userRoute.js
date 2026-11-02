const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// Proteksi seluruh route di bawah: Wajib Login & Harus Role 'admin'
router.use(verifyToken, restrictTo('admin'));

router.get('/read', userController.getAll);
router.get('/read/:id', userController.getById);
router.post('/', userController.create);
router.put('/edit/:id', userController.update);
router.delete('/delete/:id', userController.remove);

module.exports = router;