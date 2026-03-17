require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

connectDB();

// CORS
app.use(cors({
  origin: "https://ai-based-productivity-enhancer.vercel.app",
  credentials: true
}));

// Body parser
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("FlowAI Backend API Running 🚀");
});

// API routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});