const express = require("express");
const app = express();
const taskRoutes = require('./routes/taskRoutes');
app.use("/tasks",taskRoutes);
const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});