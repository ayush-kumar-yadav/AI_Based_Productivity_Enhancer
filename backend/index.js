require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Existing routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// NEW routes
const scrapeRoutes = require("./routes/scrapeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

// DB
connectDB();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-based-productivity-enhancer.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, mobile apps, and same-origin requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("FlowAI Backend API Running 🚀");
});

// API routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/analytics", analyticsRoutes);

// NEW FEATURES
app.use("/scrape", scrapeRoutes);
app.use("/payment", paymentRoutes);
app.use("/webhook", webhookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});