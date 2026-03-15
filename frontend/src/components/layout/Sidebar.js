import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <>
      <style>{`
        .sb-root {
          width: 210px; flex-shrink: 0;
          background: #1e2235;
          min-height: 100vh;
          display: flex; flex-direction: column;
          padding: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .sb-logo {
          display: flex; align-items: center; gap: 9px;
          padding: 20px 20px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 8px;
        }
        .sb-logo-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #3b72f6;
          display: flex; align-items: center; justify-content: center;
        }
        .sb-logo-name {
          font-family: 'Nunito', sans-serif;
          font-size: 19px; font-weight: 900;
          color: #fff; letter-spacing: -0.2px;
        }

        .sb-nav {
          display: flex; flex-direction: column;
          padding: 6px 12px; gap: 3px; flex: 1;
        }

        /* ── KEY FIX: inactive text is now solid white at 80% ── */
        .sb-link {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 13px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          color: rgba(255, 255, 255, 0.82);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.1px;
        }
        .sb-link:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .sb-link.sb-active {
          background: #3b72f6;
          color: #fff;
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(59,114,246,0.35);
        }
        .sb-link.sb-active:hover { background: #3068e8; }

        .sb-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
      `}</style>

      <div className="sb-root">
        <div className="sb-logo">
          <div className="sb-logo-icon">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <polyline points="3,10 8,15 17,5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="sb-logo-name">FlowAI</span>
        </div>

        <nav className="sb-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `sb-link ${isActive ? "sb-active" : ""}`}>
            <span className="sb-icon">🏠</span> Dashboard
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `sb-link ${isActive ? "sb-active" : ""}`}>
            <span className="sb-icon">✅</span> Tasks
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => `sb-link ${isActive ? "sb-active" : ""}`}>
            <span className="sb-icon">📊</span> Analytics
          </NavLink>
          <NavLink to="/ai-insights" className={({ isActive }) => `sb-link ${isActive ? "sb-active" : ""}`}>
            <span className="sb-icon">🤖</span> AI Insights
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `sb-link ${isActive ? "sb-active" : ""}`}>
            <span className="sb-icon">⚙️</span> Settings
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;