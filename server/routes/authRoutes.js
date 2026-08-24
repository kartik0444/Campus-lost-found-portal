const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/admin-login
router.post('/admin-login', authController.adminLogin);

// GET /api/auth/me
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
