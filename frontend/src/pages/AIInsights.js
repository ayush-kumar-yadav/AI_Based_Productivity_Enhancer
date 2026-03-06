import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";

function AIInsights() {

  const [insights, setInsights] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchInsights = async () => {

    const res = await API.get("/analytics/ai-summary");

    setInsights(res.data.aiInsights);
    setSuggestions(res.data.suggestions);
  };

  useEffect(()=>{
    fetchInsights();
  },[]);

  return (
    <DashboardLayout>

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <h1 className="text-3xl font-bold">
          AI Insights
        </h1>

        {insights && (

          <div className="bg-white p-6 rounded-xl shadow space-y-4">

            <h3 className="font-bold text-lg">
              Behavior Insight
            </h3>

            <p>{insights.behaviorInsight}</p>

            <h3 className="font-bold text-lg text-red-600">
              Risk Warning
            </h3>

            <p>{insights.riskWarning}</p>

            <h3 className="font-bold text-lg">
              Strategies
            </h3>

            <ul className="list-disc ml-6">
              {(insights.strategies || []).map((s,i)=>(
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3 className="font-bold text-lg text-purple-700">
              Motivation
            </h3>

            <p>{insights.motivation}</p>

          </div>
        )}

        {suggestions.length > 0 && (

          <div className="bg-blue-50 p-6 rounded-xl shadow">

            <h2 className="font-bold text-lg mb-2">
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

export default AIInsights;