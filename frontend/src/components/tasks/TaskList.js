import TaskItem from "./TaskItem";

function TaskList({ tasks, refreshTasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <>
        <style>{`
          .tasklist-empty {
            text-align: center;
            padding: 32px 20px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .tasklist-empty-icon {
            font-size: 36px; margin-bottom: 10px;
          }
          .tasklist-empty-text {
            font-size: 14px; color: #a8b0cc; font-weight: 500;
          }
        `}</style>
        <div className="tasklist-empty">
          <div className="tasklist-empty-icon">✅</div>
          <div className="tasklist-empty-text">No tasks yet. Add one above!</div>
        </div>
      </>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          refreshTasks={refreshTasks}
        />
      ))}
    </div>
  );
}

export default TaskList;