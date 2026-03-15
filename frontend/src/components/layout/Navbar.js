import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isTasksPage = location.pathname === "/tasks";

  const pageTitle = {
    "/dashboard":   "Dashboard",
    "/tasks":       "Tasks",
    "/analytics":   "Analytics",
    "/ai-insights": "AI Insights",
    "/settings":    "Settings",
  }[location.pathname] || "FlowAI";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500&display=swap');

        .nb-root {
          height: 62px; background: #fff;
          border-bottom: 1px solid #e8ecf6;
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: sticky; top: 0; z-index: 20;
        }

        .nb-title {
          font-family: 'Nunito', sans-serif;
          font-size: 17px; font-weight: 800; color: #1e2235;
        }

        .nb-right { display: flex; align-items: center; gap: 10px; }

        .nb-search {
          display: flex; align-items: center; gap: 7px;
          background: #f5f7ff; border: 1.5px solid #e2e6f3;
          border-radius: 10px; padding: 8px 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; color: #b0b9d4;
          width: 200px; outline: none;
          transition: border-color 0.18s, background 0.18s;
        }
        .nb-search:focus { border-color: #3b72f6; background: #fff; color: #1e2235; }
        .nb-search::placeholder { color: #b0b9d4; }

        .nb-logout {
          padding: 8px 16px;
          background: #fff0f0; border: 1.5px solid #fecaca;
          border-radius: 9px; color: #ef4444;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, border-color 0.15s;
        }
        .nb-logout:hover { background: #fee2e2; border-color: #fca5a5; }
      `}</style>

      <div className="nb-root">
        <div className="nb-title">{pageTitle}</div>
        <div className="nb-right">
          {isTasksPage && (
            <input
              type="text"
              placeholder="Search tasks..."
              className="nb-search"
            />
          )}
          <button onClick={handleLogout} className="nb-logout">Logout</button>
        </div>
      </div>
    </>
  );
}

export default Navbar;