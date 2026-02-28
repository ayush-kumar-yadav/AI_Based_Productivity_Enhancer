import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskList from "../components/TaskList";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔹 Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await API.post("/tasks", {
        title,
        priority,
      });

      setTitle("");
      setPriority("low");

      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  // 🔹 Derived State (Filter + Search)
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <button
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* 🔹 Add Task Form */}
      <form
        onSubmit={handleAddTask}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="Enter task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* 🔹 Search + Filter Section */}
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 border rounded ${
            filter === "all" ? "bg-gray-200" : ""
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 border rounded ${
            filter === "completed" ? "bg-gray-200" : ""
          }`}
        >
          Completed
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 border rounded ${
            filter === "pending" ? "bg-gray-200" : ""
          }`}
        >
          Pending
        </button>
      </div>

      {/* 🔹 Status Messages */}
      {loading && <p>Loading tasks...</p>}

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      {!loading && !error && filteredTasks.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          No tasks match your filter/search 🚀
        </p>
      )}

      {/* 🔹 Task List */}
      {!loading && !error && filteredTasks.length > 0 && (
        <TaskList
          tasks={filteredTasks}
          refreshTasks={fetchTasks}
        />
      )}

    </div>
  );
}

export default Dashboard;