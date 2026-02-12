const Task=require("../models/Task");

const getAllTasks=async(req,res)=>{
    try{
        const tasks = await Task.find();
        res.json(tasks);
    }catch(error){
        res.status(500).json({message:"failed to get tasks"});
    }
};
const createTask=async(req,res)=>{
    try{
        const {title, description, completed, priority} = req.body;
        const newTask = await Task.create({
            title,
            description,
            completed: false,
            priority
        });
        
        res.status(201).json(newTask);
    }catch(error){
        res.status(500).json({message:"failed to create task"});
    }
};
module.exports={
    getAllTasks,
    createTask
};