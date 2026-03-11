import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";

function AIInsights() {

  const [rankedTasks, setRankedTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const rankTasks = async () => {

    try {

      setLoading(true);

      const res = await API.get("/analytics/rank-tasks");

      setRankedTasks(res.data.rankedTasks);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  return (
    <DashboardLayout>

      <div className="max-w-4xl mx-auto space-y-8">

        <h2 className="text-3xl font-bold">
          AI Task Ranker
        </h2>

        <button
          onClick={rankTasks}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-500"
        >
          Rank My Tasks
        </button>

        {loading && (
          <p className="text-gray-500">
            AI is analyzing your tasks...
          </p>
        )}

        {rankedTasks.length > 0 && (

          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="text-xl font-semibold mb-4">
              Recommended Order
            </h3>

            <ol className="space-y-3">

              {rankedTasks.map((task, index) => (

                <li
                  key={index}
                  className="flex items-center justify-between border p-3 rounded"
                >

                  <span>
                    {index + 1}. {task}
                  </span>

                  <span className="text-purple-600 font-semibold">
                    AI Priority
                  </span>

                </li>

              ))}

            </ol>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}

export default AIInsights;