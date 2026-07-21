const express = require("express");
const router = express.Router();

// OPTIONAL: If using Redis (uncomment if needed)
// const redisClient = require("../config/redis");

// ─────────────────────────────────────────────
// POST /webhook
// Handles incoming webhook events
// ─────────────────────────────────────────────

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data || !data.event) {
      return res.status(400).json({
        status: "error",
        message: "Invalid webhook payload"
      });
    }

    console.log("📩 Webhook Received:", data);

    // ───────── EVENT HANDLING ─────────

    switch (data.event) {

      case "payment_success":
        console.log("💰 Payment Successful");
        console.log("User:", data.userId);
        console.log("Amount:", data.amount);

        // OPTIONAL: cache last payment
        /*
        await redisClient.set(
          "last_payment",
          JSON.stringify(data)
        );
        */

        break;

      case "task_created":
        console.log("📝 Task Created:", data.task);
        break;

      case "task_deleted":
        console.log("❌ Task Deleted:", data.taskId);
        break;

      default:
        console.log("⚠️ Unknown event:", data.event);
    }

    // ───────── RESPONSE ─────────
    res.status(200).json({
      status: "success",
      message: "Webhook processed successfully"
    });

  } catch (error) {
    console.error("❌ Webhook Error:", error);

    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

module.exports = router;