import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskList from "../components/TaskList";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/tasks");
        setTasks(res.data);
        
      } catch (error) {
        setError("Failed to fetch tasks");
      }finally{
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
  <div>
    <h2>Dashboard</h2>

    {loading && <p>Loading tasks...</p>}
    {error && <p className="error">{error}</p>}
    {!loading && !error && tasks.length === 0 && (
      <p>No tasks found.</p>
    )}

    {!loading && !error && tasks.length > 0 && (
      <TaskList tasks={tasks} />
    )}
  </div>
);
}

export default Dashboard;
