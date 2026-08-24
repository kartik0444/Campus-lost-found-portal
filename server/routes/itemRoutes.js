const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET /api/items
router.get('/', itemController.getItems);

// GET /api/items/:id
router.get('/:id', itemController.getItemById);

// POST /api/items
router.post('/', authMiddleware, upload.single('image'), itemController.createItem);

// PUT /api/items/:id
router.put('/:id', authMiddleware, upload.single('image'), itemController.updateItem);

// DELETE /api/items/:id
router.delete('/:id', authMiddleware, itemController.deleteItem);

module.exports = router;
