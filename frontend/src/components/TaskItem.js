import API from "../api/axios";

function TaskItem({ task, refreshTasks }) {

  const handleToggle = async () => {
    try {
      await API.patch(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      refreshTasks();
    } catch (error) {
      console.log("Toggle Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${task._id}`);
      refreshTasks();
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-3 flex justify-between items-center">

      <div>
        <h4 className={`font-semibold ${task.completed ? "line-through text-gray-500" : ""}`}>
          {task.title}
        </h4>

        <p className="text-sm text-gray-500">
          {task.completed ? "Completed" : "Pending"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Toggle
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>

    </div>
  );
}

export default TaskItem;