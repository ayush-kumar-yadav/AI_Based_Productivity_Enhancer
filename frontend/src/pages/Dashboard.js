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

  useEffect(() => { fetchTasks(); }, []);

  const recentTasks = tasks.slice(0, 5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .dash-wrap {
          max-width: 1060px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* header row */
        .dash-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          flex-wrap: wrap;
        }
        .dash-greeting {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900; color: #1e2235; margin-bottom: 3px;
        }
        .dash-greeting-sub { font-size: 14px; color: #6b7594; }

        /* AI button */
        .ai-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: #3b72f6; border: none; border-radius: 20px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 16px rgba(59,114,246,0.28);
          white-space: nowrap;
        }
        .ai-btn:hover { background: #2b5ee8; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(59,114,246,0.36); }
        .ai-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

        /* card base */
        .dash-card {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(255,255,255,0.95);
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.07);
        }
        .dash-card-title {
          font-family: 'Nunito', sans-serif;
          font-size: 16px; font-weight: 800; color: #1e2235; margin-bottom: 16px;
        }

        /* AI insights card */
        .ai-card {
          background: rgba(59,114,246,0.06);
          border: 1.5px solid rgba(59,114,246,0.18);
          border-radius: 16px; padding: 20px 24px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.06);
          animation: fadeUp 0.4s ease both;
        }
        .ai-card-label {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; color: #3b72f6; margin-bottom: 10px;
        }
        .ai-card-text { font-size: 14px; color: #4b5470; line-height: 1.65; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <DashboardLayout>
        <div className="dash-wrap">

          {/* Header */}
          <div className="dash-header">
            <div>
              <div className="dash-greeting">Good day! 👋</div>
              <div className="dash-greeting-sub">Here's what's happening with your tasks.</div>
            </div>
            <button
              onClick={fetchAiSummary}
              className="ai-btn"
              disabled={loadingAI}
            >
              ✨ {loadingAI ? "Analyzing..." : "Generate AI Summary"}
            </button>
          </div>

          {/* Stats (rendered by your existing StatsCards component) */}
          {stats && <StatsCards stats={stats} />}

          {/* Recent Tasks */}
          <div className="dash-card">
            <div className="dash-card-title">Recent Tasks</div>
            <TaskList tasks={recentTasks} refreshTasks={fetchTasks} />
          </div>

          {/* AI Insights */}
          {aiInsights && (
            <div className="ai-card">
              <div className="ai-card-label">
                <span>🤖</span> AI Summary
              </div>
              <p className="ai-card-text">{aiInsights.behaviorInsight}</p>
            </div>
          )}

        </div>
      </DashboardLayout>
    </>
  );
}

export default Dashboard;