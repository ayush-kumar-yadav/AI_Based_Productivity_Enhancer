import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskList from "../components/tasks/TaskList";

function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    await API.post("/tasks", {
      title,
      priority
    });

    setTitle("");
    setPriority("low");

    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <h1 className="text-3xl font-bold">
          Tasks
        </h1>

        {/* Add Task */}
        <form onSubmit={handleAddTask} className="flex gap-3">

          <input
            type="text"
            placeholder="Enter task"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            className="border p-2 flex-1 rounded"
          />

          <select
            value={priority}
            onChange={(e)=>setPriority(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>

        </form>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <TaskList tasks={filteredTasks} refreshTasks={fetchTasks} />

      </div>

    </DashboardLayout>
  );
}

export default Tasks;