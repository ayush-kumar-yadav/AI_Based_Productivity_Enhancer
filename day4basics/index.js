const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const app = express();
connectDB();
app.use(express.json());
app.use("/tasks", taskRoutes);
const PORT =5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
