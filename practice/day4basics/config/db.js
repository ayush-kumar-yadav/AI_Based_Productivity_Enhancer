const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ai_todo_app");
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
