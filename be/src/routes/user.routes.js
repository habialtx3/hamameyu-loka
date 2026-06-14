const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Import middleware hebat yang sudah kamu buat
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

// 1. Ambil semua user (Hanya untuk role 'admin')
router.get('/users', authenticateToken, authorizeRoles('admin'), userController.fetchAllUsers);

// 2. Ubah role user (Hanya untuk role 'admin')
router.patch('/users/:id/role', authenticateToken, authorizeRoles('admin'), userController.changeRole);

module.exports = router;