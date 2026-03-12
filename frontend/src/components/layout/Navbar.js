import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};

  const isTasksPage = location.pathname === "/tasks";

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Left side */}
      {isTasksPage ? (
        <input
          type="text"
          placeholder="Search tasks..."
          className="border rounded px-3 py-1"
        />
      ) : (
        <div></div>
      )}

      {/* Right side */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Navbar;
