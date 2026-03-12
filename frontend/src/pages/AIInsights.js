import { useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";

function AIInsights() {

  const [rankedTasks, setRankedTasks] = useState([]);
  const [insights, setInsights] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const getInsights = async () => {

    try {

      const rankRes = await API.get("/analytics/rank-tasks");
      const insightRes = await API.get("/analytics/ai-summary");

      setRankedTasks(rankRes.data.rankedTasks);
      setInsights(insightRes.data.aiInsights);
      setSuggestions(insightRes.data.suggestions);

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <DashboardLayout>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        <h1 className="text-3xl font-bold">
          AI Productivity Insights
        </h1>

        <button
          onClick={getInsights}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Analyze My Productivity
        </button>


        {/* Ranked Tasks */}
        {rankedTasks.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold mb-4">
              Recommended Task Order
            </h2>

            {rankedTasks.map((task, i) => (
              <div key={i} className="border p-3 rounded mb-2 flex justify-between">
                <span>{i + 1}. {task}</span>
                <span className="text-purple-600">
                  AI Priority
                </span>
              </div>
            ))}

          </div>
        )}


        {/* AI Summary */}
        {insights && (
          <div className="bg-purple-50 p-6 rounded-xl shadow space-y-4">

            <h2 className="text-xl font-bold">
              AI Productivity Summary
            </h2>

            <p>
              <b>Behavior:</b> {insights.behaviorInsight}
            </p>

            <p>
              <b>Risk:</b> {insights.riskWarning}
            </p>

            <p>
              <b>Motivation:</b> {insights.motivation}
            </p>

            <div>
              <b>Strategies:</b>

              <ul className="list-disc ml-6">
                {insights.strategies.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

            </div>

          </div>
        )}


        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-green-50 p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold mb-3">
              AI Suggestions
            </h2>

            <ul className="list-disc ml-6">
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

          </div>
        )}

      </div>

    </DashboardLayout>
  );
}

export default AIInsights;