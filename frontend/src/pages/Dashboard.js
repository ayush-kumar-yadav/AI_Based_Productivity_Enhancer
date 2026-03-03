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

  const [stats, setStats] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

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
      await API.post("/tasks", { title, priority });
      setTitle("");
      setPriority("low");
      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  // 🔹 Fetch AI Analytics
  const fetchAiSummary = async () => {
    try {
      setAiLoading(true);
      const res = await API.get("/analytics/ai-summary");

      setStats(res.data.stats);
      setAiInsights(res.data.aiInsights);

    } catch (err) {
      console.log(err);
    } finally {
      setAiLoading(false);
    }
  };

  // 🔹 Filter + Search
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
    <div className="max-w-5xl mx-auto p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Productivity Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add Task */}
      <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* Search + Filter */}
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <button onClick={() => setFilter("all")} className="border px-3 py-1 rounded">All</button>
        <button onClick={() => setFilter("completed")} className="border px-3 py-1 rounded">Completed</button>
        <button onClick={() => setFilter("pending")} className="border px-3 py-1 rounded">Pending</button>

        <button
          onClick={fetchAiSummary}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Analyze Productivity
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Task List */}
      {!loading && filteredTasks.length > 0 && (
        <TaskList tasks={filteredTasks} refreshTasks={fetchTasks} />
      )}

      {/* AI Section */}
      {aiLoading && <p className="mt-6">Analyzing productivity...</p>}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-50 p-4 rounded shadow">
            <h4>Total Tasks</h4>
            <p className="text-2xl font-bold">{stats.totalTasks}</p>
          </div>
          <div className="bg-green-50 p-4 rounded shadow">
            <h4>Completed</h4>
            <p className="text-2xl font-bold">{stats.completedTasks}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded shadow">
            <h4>Completion Rate</h4>
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded shadow">
            <h4>High Priority Rate</h4>
            <p className="text-2xl font-bold">
              {stats.highPriorityCompletionRate}%
            </p>
          </div>
        </div>
      )}

      {aiInsights && (
        <div className="mt-8 bg-white shadow-lg p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">AI Insights</h3>

          <div className="mb-4">
            <h4 className="font-semibold">Behavior Insight</h4>
            <p>{aiInsights.behaviorInsight}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-red-600">Risk Warning</h4>
            <p>{aiInsights.riskWarning}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold">Improvement Strategies</h4>
            <ul className="list-disc ml-6">
              {aiInsights.strategies.map((s, index) => (
                <li key={index}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-purple-700">Motivation</h4>
            <p>{aiInsights.motivation}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;