import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "Please fill all the fields"});
        }
        const existinguser = await user.findOne({email});
        if(existinguser){
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = await user.create({
            name,
            email,
            password: hashedPassword
        });
        const token = jwt.sign(
            {id: user._id},
            {expiresIn: "7d"}
        );
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch (error){
        res.status(500).json({message: "Server error"});
    }
};

export const login = async (req,res)=>{
    try{
        const{email,password}=req.body;
        if(!eamil || !password){
            return res.status(400).json({message: "All required"});
        }
        const user = await user.findOne({email});
        if(!user){
            return res.status(400).json({message: "invalid credentials"});
        }
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(error){
        res.status(500).json({message: "Server error"});
    }
};