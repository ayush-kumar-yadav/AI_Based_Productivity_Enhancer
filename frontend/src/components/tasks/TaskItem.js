import API from "../../api/axios";

function TaskItem({ task, refreshTasks }) {

  const handleToggle = async () => {
    try {
      await API.patch(`/tasks/${task._id}`, { completed: !task.completed });
      refreshTasks();
    } catch (error) {
      console.log("Toggle Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${task._id}`);
      refreshTasks();
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  const priorityColors = {
    high:   { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
    medium: { bg: "#fef9c3", color: "#b45309", dot: "#f59e0b" },
    low:    { bg: "#dcfce7", color: "#15803d", dot: "#22c55e" },
  };
  const p = priorityColors[task.priority] || priorityColors.low;

  return (
    <>
      <style>{`
        .task-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 18px;
          border-bottom: 1px solid rgba(226,230,243,0.7);
          transition: background 0.15s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .task-item:last-child { border-bottom: none; }
        .task-item:hover { background: rgba(59,114,246,0.03); }

        .task-item-left {
          display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;
        }

        /* status circle */
        .task-status-circle {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid #d8dcf0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.18s, background 0.18s;
          background: transparent;
        }
        .task-status-circle.done {
          background: #3b72f6; border-color: #3b72f6;
        }
        .task-status-circle.done::after {
          content: '';
          width: 5px; height: 9px;
          border: 2px solid #fff;
          border-top: none; border-left: none;
          transform: rotate(45deg) translateY(-1px);
          display: block;
        }

        .task-text-block { flex: 1; min-width: 0; }

        .task-title {
          font-size: 14px; font-weight: 600; color: #1e2235;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .task-title.done {
          text-decoration: line-through; color: #a8b0cc;
        }

        .task-meta {
          display: flex; align-items: center; gap: 8px; margin-top: 3px;
        }

        .task-status-badge {
          font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 20px;
        }
        .task-status-badge.pending {
          background: #f0f2ff; color: #6366f1;
        }
        .task-status-badge.completed {
          background: #dcfce7; color: #15803d;
        }

        .task-priority-badge {
          font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 20px;
          display: flex; align-items: center; gap: 4px;
        }
        .priority-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        /* action buttons */
        .task-actions { display: flex; gap: 7px; flex-shrink: 0; }

        .btn-toggle {
          padding: 6px 14px;
          background: rgba(59,114,246,0.09);
          border: 1.5px solid rgba(59,114,246,0.2);
          border-radius: 8px;
          color: #3b72f6;
          font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 800; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.12s;
          white-space: nowrap;
        }
        .btn-toggle:hover {
          background: rgba(59,114,246,0.16);
          border-color: rgba(59,114,246,0.4);
          transform: translateY(-1px);
        }

        .btn-delete {
          padding: 6px 14px;
          background: rgba(239,68,68,0.08);
          border: 1.5px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          color: #ef4444;
          font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 800; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, transform 0.12s;
          white-space: nowrap;
        }
        .btn-delete:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="task-item">
        <div className="task-item-left">

          {/* clickable status circle */}
          <div
            className={`task-status-circle ${task.completed ? "done" : ""}`}
            onClick={handleToggle}
            title="Toggle status"
          />

          <div className="task-text-block">
            <div className={`task-title ${task.completed ? "done" : ""}`}>
              {task.title}
            </div>
            <div className="task-meta">
              <span className={`task-status-badge ${task.completed ? "completed" : "pending"}`}>
                {task.completed ? "✓ Completed" : "Pending"}
              </span>
              {task.priority && (
                <span
                  className="task-priority-badge"
                  style={{ background: p.bg, color: p.color }}
                >
                  <span className="priority-dot" style={{ background: p.dot }} />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="task-actions">
          <button className="btn-toggle" onClick={handleToggle}>
            {task.completed ? "Undo" : "Done"}
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default TaskItem;