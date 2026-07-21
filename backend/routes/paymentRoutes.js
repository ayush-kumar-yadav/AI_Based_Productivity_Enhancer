const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    status: "success",
    message: "Payment simulated"
  });
});

module.exports = router;