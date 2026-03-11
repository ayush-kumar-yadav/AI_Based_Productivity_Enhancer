const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAIProductivitySummary,
  rankTasks
} = require("../controllers/analyticsController");

router.get("/ai-summary", protect, getAIProductivitySummary);
router.get("/rank-tasks", protect, rankTasks);

module.exports = router;