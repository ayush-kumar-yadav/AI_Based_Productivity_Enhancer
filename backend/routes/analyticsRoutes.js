const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {getAIProductivitySummary }= require('../controllers/analyticsController');

router.get('/ai-summary', protect, getAIProductivitySummary);
module.exports = router;