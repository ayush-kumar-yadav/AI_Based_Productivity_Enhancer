import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskList from "../components/tasks/TaskList";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    await API.post("/tasks", { title, priority });
    setTitle("");
    setPriority("low");
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .tasks-wrap {
          max-width: 860px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .tasks-heading {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900; color: #1e2235;
        }

        /* ── Add task row ── */
        .task-form {
          display: flex; gap: 10px; flex-wrap: wrap;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 14px;
          padding: 16px 18px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.07);
        }

        .task-input {
          flex: 1; min-width: 160px;
          padding: 10px 14px;
          background: #f2f4fc;
          border: 1.5px solid #d8dcf0;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #1e2235;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .task-input::placeholder { color: #a8b0cc; }
        .task-input:focus {
          border-color: #3b72f6;
          box-shadow: 0 0 0 3px rgba(59,114,246,0.10);
          background: #fff;
        }

        .task-select {
          padding: 10px 14px;
          background: #f2f4fc;
          border: 1.5px solid #d8dcf0;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #1e2235;
          outline: none; cursor: pointer;
          transition: border-color 0.18s;
        }
        .task-select:focus { border-color: #3b72f6; }

        .task-add-btn {
          padding: 10px 22px;
          background: #3b72f6; border: none; border-radius: 10px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(59,114,246,0.28);
          white-space: nowrap;
        }
        .task-add-btn:hover { background: #2b5ee8; transform: translateY(-1px); }
        .task-add-btn:active { transform: translateY(0); }

        /* ── Search bar ── */
        .task-search-wrap {
          position: relative;
        }
        .task-search-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          color: #a8b0cc; font-size: 14px; pointer-events: none;
        }
        .task-search {
          width: 100%; padding: 11px 14px 11px 36px;
          background: rgba(255,255,255,0.9);
          border: 1.5px solid #d8dcf0;
          border-radius: 11px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #1e2235; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(59,114,246,0.05);
        }
        .task-search::placeholder { color: #a8b0cc; }
        .task-search:focus {
          border-color: #3b72f6;
          box-shadow: 0 0 0 3px rgba(59,114,246,0.09);
          background: #fff;
        }

        /* ── Task list card ── */
        .tasks-card {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 14px;
          padding: 6px 0;
          box-shadow: 0 4px 18px rgba(59,114,246,0.07);
        }

        .tasks-empty {
          text-align: center; padding: 32px 0;
          color: #a8b0cc; font-size: 14px;
        }
      `}</style>

      <DashboardLayout>
        <div className="tasks-wrap">
          <div className="tasks-heading">Tasks</div>

          {/* Add Task */}
          <form className="task-form" onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Enter task title..."
              className="task-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="task-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <button type="submit" className="task-add-btn">+ Add Task</button>
          </form>

          {/* Search */}
          <div className="task-search-wrap">
            <span className="task-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tasks..."
              className="task-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="tasks-card">
            {filteredTasks.length === 0 ? (
              <div className="tasks-empty">No tasks found.</div>
            ) : (
              <TaskList tasks={filteredTasks} refreshTasks={fetchTasks} />
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export default Tasks;