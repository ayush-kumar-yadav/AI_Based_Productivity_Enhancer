import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCards from "../components/dashboard/StatsCard";
import TaskList from "../components/tasks/TaskList";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Tasks error:", err);
    }
  };

  const fetchAiSummary = async () => {

    if (loadingAI) return;

    try {

      setLoadingAI(true);

      const res = await API.get("/analytics/ai-summary");

      if (res.data) {
        setStats(res.data.stats);
        setAiInsights(res.data.aiInsights);
      }

    } catch (err) {

      console.error("AI Summary error:", err);

    }

    setLoadingAI(false);

  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const recentTasks = tasks.slice(0, 5);

  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        {/* AI Analysis Button */}
        <button
          onClick={fetchAiSummary}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loadingAI ? "Analyzing..." : "Generate AI Summary"}
        </button>

        {stats && <StatsCards stats={stats} />}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Recent Tasks
          </h2>

          <TaskList tasks={recentTasks} refreshTasks={fetchTasks} />
        </div>

        {aiInsights && (
          <div className="bg-purple-50 p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold mb-3">
              AI Summary
            </h2>

            <p>{aiInsights.behaviorInsight}</p>

          </div>
        )}

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;