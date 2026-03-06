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

  useEffect(()=>{
    fetchTasks();
  },[]);

  const total = tasks.length;
  const completed = tasks.filter(t=>t.completed).length;
  const pending = total - completed;

  const high = tasks.filter(t=>t.priority==="high").length;
  const medium = tasks.filter(t=>t.priority==="medium").length;
  const low = tasks.filter(t=>t.priority==="low").length;

  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        <h1 className="text-3xl font-bold">
          Productivity Analytics
        </h1>

        {/* ANALYZE BUTTON */}
        <button
          onClick={fetchAnalytics}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500"
        >
          Analyze Productivity
        </button>

        {loading && (
          <p className="text-gray-500">
            Analyzing productivity...
          </p>
        )}

        {/* CHARTS */}
        <div className="grid md:grid-cols-3 gap-6">

          <CompletionBarChart
            total={total}
            completed={completed}
            pending={pending}
          />

          <PriorityPieChart
            high={high}
            medium={medium}
            low={low}
          />

          
<ProductivityScore score={stats?.completionRate || 0} />
        </div>

        {/* TREND CHART */}
        {trend.length > 0 && (
          <ProductivityTrendChart data={trend} />
        )}

        {/* AI INSIGHTS */}
        {aiInsights && (

          <div className="bg-white p-6 rounded-xl shadow space-y-4">

            <h2 className="text-xl font-bold">
              AI Productivity Insights
            </h2>

            <div>
              <h3 className="font-semibold">Behavior Insight</h3>
              <p>{aiInsights.behaviorInsight}</p>
            </div>

            <div>
              <h3 className="font-semibold text-red-600">
                Risk Warning
              </h3>
              <p>{aiInsights.riskWarning}</p>
            </div>

            <div>
              <h3 className="font-semibold">
                Strategies
              </h3>

              <ul className="list-disc ml-6">
                {(aiInsights.strategies || []).map((s,i)=>(
                  <li key={i}>{s}</li>
                ))}
              </ul>

            </div>

          </div>

        )}

        {/* AI SUGGESTIONS */}
        {suggestions.length > 0 && (

          <div className="bg-blue-50 p-6 rounded-xl shadow">

            <h2 className="text-lg font-bold mb-3">
              AI Suggestions
            </h2>

            <ul className="list-disc ml-6">
              {suggestions.map((s,i)=>(
                <li key={i}>{s}</li>
              ))}
            </ul>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default Analytics;