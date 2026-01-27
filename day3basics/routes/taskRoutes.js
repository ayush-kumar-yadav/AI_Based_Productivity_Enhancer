const express = require('express');
const router = express.Router();
const{getAllTasks,getTaskById} = require('../controllers/taskControllers');
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
module.exports = router;