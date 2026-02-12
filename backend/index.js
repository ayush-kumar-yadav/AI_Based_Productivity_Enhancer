require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();  // ✅ Define app first

app.use(cors());        // ✅ Then use cors

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
