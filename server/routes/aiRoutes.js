const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/ai/match
router.post('/match', aiController.matchItems);

// POST /api/ai/generate-description
router.post('/generate-description', authMiddleware, aiController.generateDescription);

module.exports = router;
