const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

router.get('/read', kategoriController.getAll);
router.post('/', verifyToken, restrictTo('admin'), kategoriController.create);
router.put('/edit/:id', verifyToken, restrictTo('admin'), kategoriController.update);
router.delete('/delete/:id', verifyToken, restrictTo('admin'), kategoriController.remove);

module.exports = router;