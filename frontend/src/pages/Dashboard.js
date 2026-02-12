import { useEffect, useState } from "react";
import API from "../api/axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {tasks.map((task) => (
        <div key={task._id}>{task.title}</div>
      ))}
    </div>
  );
}

export default Dashboard;
