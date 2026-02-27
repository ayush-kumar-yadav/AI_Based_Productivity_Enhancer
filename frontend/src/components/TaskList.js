import TaskItem from "./TaskItem";

function TaskList({ tasks,refreshTasks}){
    return (
        <div>
            {tasks.map((task)=>(
                <TaskItem 
                key = {task._id} 
                task={task}
                refreshTasks={refreshTasks}
                 />
            ))}
        </div>
    );
}
export default TaskList;
