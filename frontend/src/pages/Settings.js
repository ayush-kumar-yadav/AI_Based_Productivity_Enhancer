import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";

function Settings() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await API.put("/users/profile", { name });
      alert("Profile updated");
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    }
  };

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

  const handleThemeChange = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    if (value === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure? This cannot be undone.");
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
    <>
      <style>{`
        .settings-wrap {
          max-width: 640px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .settings-heading {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900; color: #1e2235;
        }

        /* ── Section card ── */
        .settings-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 16px;
          padding: 24px 26px;
          box-shadow: 0 4px 18px rgba(59,114,246,0.07);
        }

        .settings-card-title {
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 800; color: #1e2235;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }

        .settings-input {
          width: 100%; padding: 11px 14px;
          background: #f2f4fc;
          border: 1.5px solid #d8dcf0;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #1e2235; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          margin-bottom: 14px;
          box-sizing: border-box;
        }
        .settings-input::placeholder { color: #a8b0cc; }
        .settings-input:focus {
          border-color: #3b72f6;
          box-shadow: 0 0 0 3px rgba(59,114,246,0.09);
          background: #fff;
        }

        .settings-select {
          padding: 11px 14px;
          background: #f2f4fc;
          border: 1.5px solid #d8dcf0;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #1e2235; outline: none;
          cursor: pointer; min-width: 160px;
          transition: border-color 0.18s;
        }
        .settings-select:focus { border-color: #3b72f6; }

        /* ── Buttons ── */
        .btn-primary {
          padding: 10px 22px;
          background: #3b72f6; border: none; border-radius: 10px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(59,114,246,0.25);
        }
        .btn-primary:hover { background: #2b5ee8; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .btn-indigo {
          padding: 10px 22px;
          background: #6366f1; border: none; border-radius: 10px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.25);
        }
        .btn-indigo:hover { background: #4f52e0; transform: translateY(-1px); }

        /* ── Danger zone card ── */
        .settings-card-danger {
          background: rgba(254,242,242,0.95);
          border: 1.5px solid rgba(239,68,68,0.18);
          border-radius: 16px;
          padding: 24px 26px;
          box-shadow: 0 4px 18px rgba(239,68,68,0.06);
        }
        .settings-card-danger .settings-card-title { color: #dc2626; }

        .btn-danger {
          padding: 10px 22px;
          background: #ef4444; border: none; border-radius: 10px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(239,68,68,0.25);
        }
        .btn-danger:hover { background: #dc2626; transform: translateY(-1px); }

        .danger-hint {
          font-size: 13px; color: #9ca3af; margin-bottom: 14px;
        }
      `}</style>

      <DashboardLayout>
        <div className="settings-wrap">
          <div className="settings-heading">Settings</div>

          {/* Profile */}
          <div className="settings-card">
            <div className="settings-card-title">👤 Profile</div>
            <input
              type="text"
              placeholder="Update your name"
              className="settings-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn-primary" onClick={handleProfileUpdate}>
              Update Profile
            </button>
          </div>

          {/* Password */}
          <div className="settings-card">
            <div className="settings-card-title">🔒 Change Password</div>
            <input
              type="password"
              placeholder="Enter new password"
              className="settings-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-indigo" onClick={handlePasswordUpdate}>
              Update Password
            </button>
          </div>

          {/* Theme */}
          <div className="settings-card">
            <div className="settings-card-title">🎨 Theme</div>
            <select
              className="settings-select"
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
            </select>
          </div>

          {/* Danger Zone */}
          <div className="settings-card-danger">
            <div className="settings-card-title">⚠️ Danger Zone</div>
            <p className="danger-hint">This will permanently delete your account and all data.</p>
            <button className="btn-danger" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export default Settings;