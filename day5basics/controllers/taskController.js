const Task = require("../models/Task");

// GET ALL TASKS

const getAllTasks = async(req,res)=>{
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({message: "failed to get tasks"});
    }
};

// GET TASK BY ID

const getTaskById = async(req,res)=>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json(task);
    }catch(error){
        res.status(500).json({message: "invalid task id"});
    }
};

// POST NEW TASK

const createTask = async(req,res)=>{
    try{
        const {title, description, completed} = req.body;
        if(!title){
            return res.status(400).json({message: "Title is required"});
        }
        const newTask = await Task.create({
            title,
            description,
            priority,
            completed: completed || false
        });
        res.status(201).json(newTask);
    }catch(error){
        res.status(500).json({message: "failed to create task"});
    }
};

// UPDATE TASK BY ID

const updateTask = async (req,res)=>{
    try{
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        if(!updatedTask){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json(updatedTask);
    }catch(error){
        res.status(400).json({message: "failed to update task"});
    }
};

// DELETE TASK BY ID

const deleteTask = async(req,res)=>{
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if(!deletedTask){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({message: "Task deleted successfully"});
    }catch(error){
        res.status(500).json({message: "failed to delete task"});
    }
};
module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};