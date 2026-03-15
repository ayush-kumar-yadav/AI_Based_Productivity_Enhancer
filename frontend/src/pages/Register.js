import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .lr-root {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .lr-card {
          position: relative; z-index: 1;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 20px;
          padding: 36px 34px 28px;
          width: 100%; max-width: 400px;
          box-shadow: 0 8px 40px rgba(59,114,246,0.11), 0 2px 8px rgba(59,114,246,0.06);
          animation: cardUp 0.4s ease both;
        }
        @keyframes cardUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .lr-brand {
          display: flex; align-items: center; justify-content: center;
          gap: 9px; margin-bottom: 18px;
        }
        .lr-brand-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: #3b72f6;
          display: flex; align-items: center; justify-content: center;
        }
        .lr-brand-name {
          font-family: 'Nunito', sans-serif;
          font-size: 21px; font-weight: 900;
          color: #1e2235; letter-spacing: -0.3px;
        }

        .lr-title {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 800;
          color: #1e2235; text-align: center; margin-bottom: 5px;
        }
        .lr-sub { font-size: 13.5px; color: #6b7594; text-align: center; margin-bottom: 24px; }

        .lr-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #1e2235; margin-bottom: 6px;
        }
        .lr-input {
          width: 100%; padding: 11px 13px;
          background: #f2f4fc; border: 1.5px solid #d8dcf0;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #1e2235; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          margin-bottom: 14px; box-sizing: border-box;
        }
        .lr-input::placeholder { color: #a8b0cc; }
        .lr-input:focus {
          border-color: #3b72f6;
          box-shadow: 0 0 0 3px rgba(59,114,246,0.10); background: #fff;
        }

        .lr-btn {
          width: 100%; padding: 12px;
          background: #3b72f6; border: none; border-radius: 12px;
          color: #fff; font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 800; cursor: pointer;
          transition: background 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 16px rgba(59,114,246,0.30); margin-top: 4px;
        }
        .lr-btn:hover { background: #2b5ee8; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(59,114,246,0.38); }
        .lr-btn:active { transform: translateY(0); }

        .lr-footer { text-align: center; margin-top: 16px; font-size: 13px; color: #6b7594; }
        .lr-link { color: #3b72f6; font-weight: 700; cursor: pointer; transition: color 0.15s; }
        .lr-link:hover { color: #2b5ee8; }

        .lr-copy {
          position: relative; z-index: 1; margin-top: 20px;
          font-size: 12px; color: #8890aa; text-align: center;
        }
      `}</style>

      <div className="doodle-bg lr-root">
        <div className="lr-card">
          <div className="lr-brand">
            <div className="lr-brand-icon">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <polyline points="3,10 8,15 17,5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="lr-brand-name">FlowAI</span>
          </div>

          <h1 className="lr-title">Create Account</h1>
          <p className="lr-sub">Start managing your tasks smarter with AI.</p>

          <form onSubmit={handleRegister}>
            <div className="lr-label">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#8a93b0" strokeWidth="1.8">
                <circle cx="10" cy="7" r="4"/><path d="M2 19c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Name
            </div>
            <input
              type="text" placeholder="John Doe" className="lr-input"
              value={name} onChange={(e) => setName(e.target.value)}
            />

            <div className="lr-label">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#8a93b0" strokeWidth="1.8">
                <rect x="2" y="5" width="16" height="12" rx="2"/>
                <polyline points="2,5 10,13 18,5"/>
              </svg>
              Email
            </div>
            <input
              type="email" placeholder="name@example.com" className="lr-input"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />

            <div className="lr-label">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#8a93b0" strokeWidth="1.8">
                <rect x="4" y="9" width="12" height="10" rx="2"/><path d="M7 9V6a3 3 0 016 0v3"/>
              </svg>
              Password
            </div>
            <input
              type="password" placeholder="Min. 8 characters" className="lr-input"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="lr-btn">Create Account</button>
          </form>

          <p className="lr-footer">
            Already have an account?{" "}
            <span className="lr-link" onClick={() => navigate("/")}>Sign In</span>
          </p>
        </div>
        <p className="lr-copy">© 2025 FlowAI. All rights reserved.</p>
      </div>
    </>
  );
}

export default Register;