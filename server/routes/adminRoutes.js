const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/users
router.get('/users', adminController.getAllUsers);

// GET /api/admin/items
router.get('/items', adminController.getAllItems);

// DELETE /api/admin/items/:id
router.delete('/items/:id', adminController.adminDeleteItem);

module.exports = router;
