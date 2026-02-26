import TaskItem from "./TaskItem";

function TaskItem({ tasks}){
    return (
        <div>
            {tasks.map((task)=>(
                <TaskItem key = {task._id} task={task}/>
            ))}
        </div>
    );
}
export default TaskItem;
