function TaskItem({ task }) {
    return (
        <div className = "border p-3 mb-2 rounded">
            <h4>{task.title}</h4>
            <p>{task.completed ? "Completed" : "pending"}</p>
        </div>
    );
}
export default TaskItem;