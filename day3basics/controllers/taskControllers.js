const tasks=[
    {id:1, title: "learn express", completed:false},
    {id:2, title: "build a REST API", completed:false},
    {id:3, title: "backend", completed:false}
];
const getAllTasks=(req,res)=>{
    res.json(tasks);
}
const getTaskById=(req,res)=>{
    const taskId=parseInt(req.params.id);
    const task = tasks.find(t => t.id==taskId);
    if(!task){
        return res.status(404).json({message: "Task not found"});
    }
    res.json(task);
}
module.exports={getAllTasks,getTaskById};
