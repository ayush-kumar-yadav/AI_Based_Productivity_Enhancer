import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";

function Settings() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");

  const handleProfileUpdate = async () => {
    try {

      await API.put("/users/profile", {
        name
      });

      alert("Profile updated");

    } catch (error) {

      console.log(error);

    }
  };

  const handlePasswordUpdate = async () => {

    try {

      await API.put("/users/password", {
        password
      });

      alert("Password updated");

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <DashboardLayout>

      <div className="max-w-4xl mx-auto space-y-8">

        <h2 className="text-3xl font-bold">
          Settings
        </h2>

        {/* Profile Settings */}

        <div className="bg-white p-6 rounded-xl shadow">

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


        {/* Password Settings */}

        <div className="bg-white p-6 rounded-xl shadow">

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


        {/* Theme Settings */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="text-xl font-semibold mb-4">
            Theme
          </h3>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border p-2 rounded"
          >

            <option value="light">
              Light
            </option>

            <option value="dark">
              Dark
            </option>

          </select>

        </div>


        {/* Danger Zone */}

        <div className="bg-red-50 p-6 rounded-xl shadow">

          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h3>

          <button
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