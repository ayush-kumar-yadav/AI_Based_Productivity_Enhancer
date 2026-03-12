import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AIRobot from "../ai/AIRobot";

function DashboardLayout({ children }) {

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">

        {/* Top navbar */}
        <Navbar />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>

        {/* AI Assistant Robot */}
        <AIRobot />

      </div>

    </div>
  );
}

export default DashboardLayout;