import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";

function Settings() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");


  // Load saved theme
  useEffect(() => {

    const savedTheme = localStorage.getItem("theme") || "light";

    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

  }, []);


  // Update profile
  const handleProfileUpdate = async () => {

    try {

      await API.put("/users/profile", { name });

      alert("Profile updated");

    } catch (error) {

      console.log(error);
      alert("Failed to update profile");

    }

  };


  // Update password
  const handlePasswordUpdate = async () => {

    try {

      await API.put("/users/password", { password });

      alert("Password updated");

      setPassword("");

    } catch (error) {

      console.log(error);
      alert("Failed to update password");

    }

  };


  // Theme change
  const handleThemeChange = (value) => {

    setTheme(value);

    localStorage.setItem("theme", value);

    if (value === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

  };


  // Delete account
  const handleDeleteAccount = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {

      await API.delete("/auth/delete");

      localStorage.removeItem("token");

      alert("Account deleted successfully");

      window.location.href = "/";

    } catch (error) {

      console.log(error);

      alert("Failed to delete account");

    }

  };


  return (
    <DashboardLayout>

      <div className="max-w-4xl mx-auto space-y-8">

        <h2 className="text-3xl font-bold">
          Settings
        </h2>


        {/* Profile */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h3 className="text-xl font-semibold mb-4">
            Profile
          </h3>

          <input
            type="text"
            placeholder="Update name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={handleProfileUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Update Profile
          </button>

        </div>


        {/* Password */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h3 className="text-xl font-semibold mb-4">
            Change Password
          </h3>

          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={handlePasswordUpdate}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            Update Password
          </button>

        </div>


        {/* Theme */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h3 className="text-xl font-semibold mb-4">
            Theme
          </h3>

          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

        </div>


        {/* Danger Zone */}
        <div className="bg-red-50 p-6 rounded-xl shadow">

          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h3>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
          >
            Delete Account
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default Settings;