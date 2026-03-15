import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AIRobot from "../ai/AIRobot";

function DashboardLayout({ children }) {
  return (
    <>
      <style>{`
        .dl-root { display: flex; min-height: 100vh; }

        .dl-main {
          display: flex; flex-direction: column; flex: 1; min-width: 0;
        }

        /* doodle-bg is on dl-main — the ::before pseudo from index.css
           will cover the entire content area behind sidebar */
        .dl-content {
          flex: 1; overflow-y: auto;
          padding: 26px 28px;
          position: relative; z-index: 1;
        }
        .dl-content::-webkit-scrollbar { width: 5px; }
        .dl-content::-webkit-scrollbar-track { background: transparent; }
        .dl-content::-webkit-scrollbar-thumb { background: #b8c0dc; border-radius: 4px; }
      `}</style>

      <div className="dl-root">
        <Sidebar />
        {/* doodle-bg class applies the background + doodle pattern */}
        <div className="doodle-bg dl-main">
          <Navbar />
          <main className="dl-content">{children}</main>
          <AIRobot />
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;