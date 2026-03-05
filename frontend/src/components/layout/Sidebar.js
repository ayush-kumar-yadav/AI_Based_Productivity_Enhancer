import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle =
    "block px-4 py-2 rounded hover:bg-slate-700 transition";

  const activeStyle = "bg-slate-700";

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6">

      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10">
        FlowAI
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Tasks
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Analytics
        </NavLink>

        <NavLink
          to="/ai-insights"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          AI Insights
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : ""}`
          }
        >
          Settings
        </NavLink>

      </nav>
    </div>
  );
}

export default Sidebar;