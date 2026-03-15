import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import CompletionBarChart from "../components/charts/CompletionBarChart";
import PriorityPieChart from "../components/charts/PriorityPieChart";
import ProductivityTrendChart from "../components/charts/ProductivityTrendChart";
import ProductivityScore from "../components/charts/ProductivityScore";

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [trend, setTrend] = useState([]);
  const [stats, setStats] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/analytics/ai-summary");
      setStats(res.data.stats);
      setTrend(res.data.trend || []);
      setAiInsights(res.data.aiInsights);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.log("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;
  const high      = tasks.filter(t => t.priority === "high").length;
  const medium    = tasks.filter(t => t.priority === "medium").length;
  const low       = tasks.filter(t => t.priority === "low").length;

  return (
    <>
      <style>{`
        .analytics-wrap {
          max-width: 1060px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 22px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .analytics-heading {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900; color: #1e2235;
        }

        .analytics-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px;
          background: #7c3aed; border: none; border-radius: 20px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(124,58,237,0.28);
          align-self: flex-start;
        }
        .analytics-btn:hover { background: #6d28d9; transform: translateY(-1px); }
        .analytics-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .analytics-loading {
          font-size: 13px; color: #8a93b0;
          display: flex; align-items: center; gap: 8px;
        }

        /* Charts grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
        }

        .chart-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 16px; padding: 20px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.07);
        }

        /* AI insights card */
        .insights-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 16px; padding: 24px 26px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.07);
          display: flex; flex-direction: column; gap: 16px;
        }

        .insights-card-title {
          font-family: 'Nunito', sans-serif;
          font-size: 16px; font-weight: 800; color: #1e2235;
        }

        .insight-block { display: flex; flex-direction: column; gap: 5px; }

        .insight-label {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; color: #8a93b0;
        }
        .insight-label.red { color: #dc2626; }

        .insight-text { font-size: 14px; color: #4b5470; line-height: 1.6; }

        .insight-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 6px;
        }
        .insight-list li {
          font-size: 14px; color: #4b5470; line-height: 1.5;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .insight-list li::before {
          content: '→'; color: #7c3aed; font-weight: 700; flex-shrink: 0; margin-top: 1px;
        }

        /* Suggestions card */
        .suggestions-card {
          background: rgba(59,114,246,0.05);
          border: 1.5px solid rgba(59,114,246,0.16);
          border-radius: 16px; padding: 22px 26px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.06);
        }

        .suggestions-title {
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 800; color: #3b72f6; margin-bottom: 14px;
        }

        .suggestions-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .suggestions-list li {
          font-size: 14px; color: #4b5470; line-height: 1.5;
          display: flex; align-items: flex-start; gap: 8px;
          background: rgba(255,255,255,0.7);
          border-radius: 8px; padding: 9px 12px;
        }
        .suggestions-list li::before {
          content: '💡'; flex-shrink: 0;
        }
      `}</style>

      <DashboardLayout>
        <div className="analytics-wrap">
          <div className="analytics-heading">Productivity Analytics</div>

          <button
            className="analytics-btn"
            onClick={fetchAnalytics}
            disabled={loading}
          >
            {loading ? "⏳ Analyzing..." : "✨ Analyze Productivity"}
          </button>

          {loading && (
            <p className="analytics-loading">🔄 Crunching your data...</p>
          )}

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <CompletionBarChart total={total} completed={completed} pending={pending} />
            </div>
            <div className="chart-card">
              <PriorityPieChart high={high} medium={medium} low={low} />
            </div>
            <div className="chart-card">
              <ProductivityScore score={stats?.completionRate || 0} />
            </div>
          </div>

          {trend.length > 0 && (
            <div className="chart-card">
              <ProductivityTrendChart data={trend} />
            </div>
          )}

          {/* AI Insights */}
          {aiInsights && (
            <div className="insights-card">
              <div className="insights-card-title">🤖 AI Productivity Insights</div>

              <div className="insight-block">
                <span className="insight-label">Behavior Insight</span>
                <p className="insight-text">{aiInsights.behaviorInsight}</p>
              </div>

              <div className="insight-block">
                <span className="insight-label red">⚠️ Risk Warning</span>
                <p className="insight-text">{aiInsights.riskWarning}</p>
              </div>

              <div className="insight-block">
                <span className="insight-label">Strategies</span>
                <ul className="insight-list">
                  {(aiInsights.strategies || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="suggestions-card">
              <div className="suggestions-title">AI Suggestions</div>
              <ul className="suggestions-list">
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}

export default Analytics;