import { useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";

function AIInsights() {
  const [rankedTasks, setRankedTasks] = useState([]);
  const [insights, setInsights] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    try {
      setLoading(true);
      const rankRes    = await API.get("/analytics/rank-tasks");
      const insightRes = await API.get("/analytics/ai-summary");
      setRankedTasks(rankRes.data.rankedTasks);
      setInsights(insightRes.data.aiInsights);
      setSuggestions(insightRes.data.suggestions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .ai-wrap {
          max-width: 860px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 22px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ai-heading {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900; color: #1e2235;
        }

        .ai-analyze-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px; align-self: flex-start;
          background: #7c3aed; border: none; border-radius: 20px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(124,58,237,0.28);
        }
        .ai-analyze-btn:hover { background: #6d28d9; transform: translateY(-1px); }
        .ai-analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* ── Ranked tasks ── */
        .ai-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 16px; padding: 22px 24px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.07);
        }

        .ai-card-title {
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 800; color: #1e2235; margin-bottom: 16px;
        }

        .ranked-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px; margin-bottom: 8px;
          background: #f5f7ff;
          border: 1.5px solid #e2e6f3;
          border-radius: 10px;
          font-size: 14px; color: #1e2235;
          transition: border-color 0.15s;
        }
        .ranked-item:last-child { margin-bottom: 0; }
        .ranked-item:hover { border-color: #b8c4f0; }

        .ranked-num {
          width: 26px; height: 26px; border-radius: 50%;
          background: #3b72f6; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800;
          flex-shrink: 0; margin-right: 12px;
        }

        .ranked-left { display: flex; align-items: center; }

        .ranked-badge {
          font-size: 11px; font-weight: 700; color: #7c3aed;
          background: rgba(124,58,237,0.1); border-radius: 6px; padding: 3px 9px;
        }

        /* ── Summary card ── */
        .summary-card {
          background: rgba(124,58,237,0.05);
          border: 1.5px solid rgba(124,58,237,0.16);
          border-radius: 16px; padding: 24px 26px;
          box-shadow: 0 4px 18px rgba(124,58,237,0.06);
          display: flex; flex-direction: column; gap: 16px;
        }

        .summary-card-title {
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 800; color: #7c3aed;
        }

        .summary-row { display: flex; flex-direction: column; gap: 4px; }

        .summary-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.5px; color: #a890e0;
        }

        .summary-text { font-size: 14px; color: #4b5470; line-height: 1.6; }

        .strategy-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 6px;
        }
        .strategy-list li {
          font-size: 14px; color: #4b5470; line-height: 1.5;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .strategy-list li::before {
          content: '✦'; color: #7c3aed; font-size: 10px; flex-shrink: 0; margin-top: 3px;
        }

        /* ── Suggestions ── */
        .suggestions-card {
          background: rgba(16,185,129,0.05);
          border: 1.5px solid rgba(16,185,129,0.18);
          border-radius: 16px; padding: 22px 26px;
          box-shadow: 0 4px 18px rgba(16,185,129,0.05);
        }

        .suggestions-title {
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 800; color: #059669; margin-bottom: 14px;
        }

        .suggestions-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .suggestions-list li {
          font-size: 14px; color: #4b5470; line-height: 1.5;
          background: rgba(255,255,255,0.8);
          border-radius: 8px; padding: 10px 13px;
          display: flex; align-items: flex-start; gap: 8px;
        }
        .suggestions-list li::before { content: '💡'; flex-shrink: 0; }
      `}</style>

      <DashboardLayout>
        <div className="ai-wrap">
          <div className="ai-heading">AI Productivity Insights</div>

          <button
            className="ai-analyze-btn"
            onClick={getInsights}
            disabled={loading}
          >
            {loading ? "⏳ Analyzing..." : "🤖 Analyze My Productivity"}
          </button>

          {/* Ranked Tasks */}
          {rankedTasks.length > 0 && (
            <div className="ai-card">
              <div className="ai-card-title">📋 Recommended Task Order</div>
              {rankedTasks.map((task, i) => (
                <div key={i} className="ranked-item">
                  <div className="ranked-left">
                    <div className="ranked-num">{i + 1}</div>
                    <span>{task}</span>
                  </div>
                  <span className="ranked-badge">AI Priority</span>
                </div>
              ))}
            </div>
          )}

          {/* AI Summary */}
          {insights && (
            <div className="summary-card">
              <div className="summary-card-title">🧠 AI Productivity Summary</div>

              <div className="summary-row">
                <span className="summary-label">Behavior</span>
                <p className="summary-text">{insights.behaviorInsight}</p>
              </div>

              <div className="summary-row">
                <span className="summary-label">Risk</span>
                <p className="summary-text">{insights.riskWarning}</p>
              </div>

              <div className="summary-row">
                <span className="summary-label">Motivation</span>
                <p className="summary-text">{insights.motivation}</p>
              </div>

              <div className="summary-row">
                <span className="summary-label">Strategies</span>
                <ul className="strategy-list">
                  {(insights.strategies || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="suggestions-card">
              <div className="suggestions-title">💡 AI Suggestions</div>
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

export default AIInsights;