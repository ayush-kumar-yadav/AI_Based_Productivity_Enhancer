import express from "express";
import authRoutes from "./routes/authRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("api is running");
});
app.use("/api/auth", authRoutes);
app.use((req,res)=>{
    res.status(404).json({message: "Route not found"});
});

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
}).catch((error)=>{
    console.error("Error connecting to MongoDB",error);
});
