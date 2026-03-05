import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskList from "../components/tasks/TaskList";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCards from "../components/dashboard/StatsCard";
import CompletionBarChart from "../components/charts/CompletionBarChart";
import PriorityPieChart from "../components/charts/PriorityPieChart";
import ProductivityScore from "../components/charts/ProductivityScore";
import ProductivityTrendChart from "../components/charts/ProductivityTrendChart";

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
  const [suggestions, setSuggestions] = useState([]);
  const [trend, setTrend] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/tasks");
      setTasks(res.data);

    } catch {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await API.post("/tasks", { title, priority });

      setTitle("");
      setPriority("low");

      fetchTasks();

    } catch {
      setError("Failed to add task");
    }
  };

  // Fetch AI analytics
  const fetchAiSummary = async () => {
    try {
      setAiLoading(true);

      const res = await API.get("/analytics/ai-summary");

      setStats(res.data.stats);
      setAiInsights(res.data.aiInsights);
      setSuggestions(res.data.suggestions || []);
      setTrend(res.data.trend || []);

    } catch (err) {
      console.log(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Filter + search
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  // Chart analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const completionRate =
    totalTasks > 0
      ? ((completedTasks / totalTasks) * 100).toFixed(2)
      : 0;

  const highCount = tasks.filter(t => t.priority === "high").length;
  const mediumCount = tasks.filter(t => t.priority === "medium").length;
  const lowCount = tasks.filter(t => t.priority === "low").length;

  return (
  <DashboardLayout>
    <div className="max-w-7xl mx-auto p-6 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Productivity Dashboard</h2>

        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Add Task */}
      <form onSubmit={handleAddTask} className="flex gap-3">

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Add
        </button>

      </form>

      {/* Search + Filters */}
      <div className="flex gap-2 items-center">

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <button onClick={() => setFilter("all")} className="border px-3 py-1 rounded">
          All
        </button>

        <button onClick={() => setFilter("completed")} className="border px-3 py-1 rounded">
          Completed
        </button>

        <button onClick={() => setFilter("pending")} className="border px-3 py-1 rounded">
          Pending
        </button>

        <button
          onClick={fetchAiSummary}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500"
        >
          Analyze Productivity
        </button>

      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Charts Section */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <CompletionBarChart
              total={totalTasks}
              completed={completedTasks}
              pending={pendingTasks}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <PriorityPieChart
              high={highCount}
              medium={mediumCount}
              low={lowCount}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <ProductivityScore
              score={stats?.completionRate || completionRate}
            />
          </div>

        </div>

        {/* Tasks Section */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="text-xl font-bold mb-4">
            Tasks
          </h3>

          {!loading && filteredTasks.length > 0 && (
            <TaskList
              tasks={filteredTasks}
              refreshTasks={fetchTasks}
            />
          )}

        </div>

      </div>

      {/* Trend Chart */}
      {trend.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <ProductivityTrendChart data={trend} />
        </div>
      )}

      {/* AI Loading */}
      {aiLoading && <p>Analyzing productivity...</p>}

      {/* AI Insights */}
      {aiInsights && (
        <div className="bg-white shadow-lg p-6 rounded-xl">

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
              {(aiInsights.strategies || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-purple-700">Motivation</h4>
            <p>{aiInsights.motivation}</p>
          </div>

        </div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-xl shadow">

          <h3 className="text-lg font-bold mb-3">
            AI Productivity Suggestions
          </h3>

          <ul className="list-disc ml-6">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

        </div>
      )}

    </div>
    <div className="bg-red-500 text-white p-4">
  Tailwind Test
</div>
  </DashboardLayout>
);
}

export default Dashboard;