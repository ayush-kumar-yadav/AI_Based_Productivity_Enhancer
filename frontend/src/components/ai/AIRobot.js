import { useState } from "react";
import API from "../../api/axios";

/* ────────────────────────────────────────────
   SVG Robot — bigger, more detailed
──────────────────────────────────────────── */
const RobotSVG = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 52 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="26" y1="4" x2="26" y2="10" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="26" cy="3" r="2.5" fill="#818cf8"/>
    <circle cx="26" cy="3" r="4" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.4"/>
    <rect x="12" y="10" width="28" height="21" rx="7" fill="#4f46e5"/>
    <rect x="12" y="10" width="28" height="21" rx="7" stroke="#6366f1" strokeWidth="1"/>
    <rect x="15.5" y="16" width="9" height="7" rx="2.5" fill="#e0f2fe"/>
    <rect x="17.5" y="17.5" width="5" height="4" rx="1.5" fill="#0ea5e9"/>
    <circle cx="20" cy="19.5" r="1.5" fill="#fff"/>
    <circle cx="21" cy="18.5" r="0.8" fill="#fff" opacity="0.7"/>
    <rect x="27.5" y="16" width="9" height="7" rx="2.5" fill="#e0f2fe"/>
    <rect x="29.5" y="17.5" width="5" height="4" rx="1.5" fill="#0ea5e9"/>
    <circle cx="32" cy="19.5" r="1.5" fill="#fff"/>
    <circle cx="33" cy="18.5" r="0.8" fill="#fff" opacity="0.7"/>
    <rect x="18" y="26" width="16" height="3.5" rx="1.8" fill="#3730a3"/>
    <rect x="19.5" y="26.8" width="3" height="2" rx="1" fill="#818cf8"/>
    <rect x="24" y="26.8" width="3" height="2" rx="1" fill="#818cf8"/>
    <rect x="28.5" y="26.8" width="3" height="2" rx="1" fill="#818cf8"/>
    <rect x="22" y="31" width="8" height="5" rx="2" fill="#4338ca"/>
    <rect x="9" y="36" width="34" height="20" rx="8" fill="#4f46e5"/>
    <rect x="9" y="36" width="34" height="20" rx="8" stroke="#6366f1" strokeWidth="1"/>
    <rect x="16" y="39" width="20" height="12" rx="4" fill="#3730a3"/>
    <circle cx="21" cy="45" r="2.5" fill="#34d399"/>
    <circle cx="21" cy="45" r="1.2" fill="#6ee7b7"/>
    <circle cx="26" cy="45" r="2.5" fill="#fbbf24"/>
    <circle cx="26" cy="45" r="1.2" fill="#fde68a"/>
    <circle cx="31" cy="45" r="2.5" fill="#f87171"/>
    <circle cx="31" cy="45" r="1.2" fill="#fca5a5"/>
    <rect x="1" y="37" width="8" height="15" rx="4" fill="#4338ca"/>
    <rect x="1" y="37" width="8" height="15" rx="4" stroke="#6366f1" strokeWidth="0.8"/>
    <rect x="1.5" y="50" width="7" height="5" rx="3.5" fill="#312e81"/>
    <rect x="43" y="37" width="8" height="15" rx="4" fill="#4338ca"/>
    <rect x="43" y="37" width="8" height="15" rx="4" stroke="#6366f1" strokeWidth="0.8"/>
    <rect x="43.5" y="50" width="7" height="5" rx="3.5" fill="#312e81"/>
    <ellipse cx="18.5" cy="56" rx="5" ry="3" fill="#312e81"/>
    <ellipse cx="33.5" cy="56" rx="5" ry="3" fill="#312e81"/>
  </svg>
);

/* ────────────────────────────────────────────
   Speech bubble messages — cycles automatically
──────────────────────────────────────────── */
const BUBBLE_MESSAGES = [
  "Hi! I'm here to help 👋",
  "Ask me what to do next!",
  "How's your productivity?",
  "Need a task suggestion?",
];

function AIRobot() {
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [unread, setUnread]     = useState(false);
  const [input, setInput]       = useState("");
  const [bubbleIdx, setBubbleIdx] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI productivity coach 🚀 Ask me what to work on, or check your productivity insights!" }
  ]);

  /* cycle bubble message every 4s */
  useState(() => {
    const iv = setInterval(() => {
      setBubbleVisible(false);
      setTimeout(() => {
        setBubbleIdx(i => (i + 1) % BUBBLE_MESSAGES.length);
        setBubbleVisible(true);
      }, 350);
    }, 4000);
    return () => clearInterval(iv);
  });

  const addAiMsg = (text) => {
    setMessages(prev => [...prev, { role: "ai", text }]);
    if (!open) setUnread(true);
  };

  const getSuggestions = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await API.get("/analytics/rank-tasks");
      const ranked = res.data.rankedTasks;
      addAiMsg("Here are your most important tasks:");
      addAiMsg(ranked.map((t, i) => `${i + 1}. ${t}`).join(" • "));
    } catch {
      addAiMsg("Couldn't fetch tasks. Try again in a moment!");
    }
    setLoading(false);
  };

  const getInsights = async () => {
    try {
      setLoading(true);
      const res = await API.get("/analytics/ai-summary");
      const insight = res.data.aiInsights?.behaviorInsight;
      addAiMsg(insight || "Your productivity looks steady. Keep it up! 💪");
    } catch {
      addAiMsg("Couldn't load insights right now.");
    }
    setLoading(false);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    const q = input.toLowerCase();
    if (q.includes("suggest") || q.includes("what should") || q.includes("task")) {
      getSuggestions();
    } else if (q.includes("productivity") || q.includes("insight") || q.includes("how am i")) {
      getInsights();
    } else {
      addAiMsg("Try asking 'What should I do?' or 'Show my productivity'!");
    }
    setInput("");
  };

  const handleToggle = () => {
    setOpen(o => !o);
    setUnread(false);
  };

  return (
    <>
      <style>{`
        /* ── FAB area ── */
        .robo-fab-area {
          position: fixed;
          bottom: 22px; right: 24px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        /* ── Speech bubble ── */
        .robo-speech {
          position: relative;
          background: #fff;
          border: 1.5px solid #e0e7ff;
          border-radius: 14px;
          padding: 9px 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: #4338ca;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(79,70,229,0.13);
          margin-bottom: 8px;
          transition: opacity 0.3s, transform 0.3s;
          cursor: pointer;
          user-select: none;
        }
        .robo-speech.hidden {
          opacity: 0;
          transform: translateY(4px) scale(0.96);
          pointer-events: none;
        }
        .robo-speech.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        /* tail pointing DOWN toward robot */
        .robo-speech::after {
          content: '';
          position: absolute;
          bottom: -9px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 9px solid #fff;
          filter: drop-shadow(0 2px 1px rgba(79,70,229,0.08));
        }
        .robo-speech::before {
          content: '';
          position: absolute;
          bottom: -11px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-top: 10px solid #e0e7ff;
        }

        /* ── Robot wrapper ── */
        .robo-body-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        /* ── Jump animation ── */
        @keyframes roboJump {
          0%,100% { transform: translateY(0) rotate(0deg); }
          28%      { transform: translateY(-12px) rotate(-4deg); }
          55%      { transform: translateY(-8px) rotate(3deg); }
          78%      { transform: translateY(-2px) rotate(-1deg); }
        }
        @keyframes roboShadow {
          0%,100% { transform: scaleX(1); opacity: 0.22; }
          28%      { transform: scaleX(0.5); opacity: 0.08; }
          55%      { transform: scaleX(0.65); opacity: 0.13; }
        }
        .robo-jump {
          animation: roboJump 2.2s ease-in-out infinite;
          filter: drop-shadow(0 8px 20px rgba(79,70,229,0.42));
          transition: filter 0.2s, transform 0.2s;
        }
        .robo-jump:hover {
          filter: drop-shadow(0 12px 28px rgba(79,70,229,0.62));
          animation-play-state: paused;
          transform: scale(1.08) translateY(-4px) !important;
        }
        .robo-shadow {
          width: 48px; height: 9px;
          background: rgba(79,70,229,0.22);
          border-radius: 50%;
          margin-top: 3px;
          animation: roboShadow 2.2s ease-in-out infinite;
        }

        /* unread badge */
        .robo-unread {
          position: absolute;
          top: -2px; right: -2px;
          width: 13px; height: 13px;
          background: #f87171;
          border-radius: 50%;
          border: 2.5px solid #eef0f9;
          animation: roboUnreadPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes roboUnreadPop {
          from { transform: scale(0); } to { transform: scale(1); }
        }

        /* ── Chat window ── */
        .robo-win {
          position: fixed; bottom: 28px; right: 116px; z-index: 999;
          width: 320px; height: 440px;
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(255,255,255,0.98);
          border-radius: 20px;
          box-shadow: 0 16px 60px rgba(79,70,229,0.14), 0 2px 8px rgba(79,70,229,0.08);
          display: flex; flex-direction: column; overflow: hidden;
          animation: roboWinPop 0.24s cubic-bezier(0.34,1.56,0.64,1) both;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        @keyframes roboWinPop {
          from { opacity:0; transform: scale(0.88) translateY(12px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }

        /* header */
        .robo-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          flex-shrink: 0;
        }
        .robo-hdr-left { display: flex; align-items: center; gap: 9px; }
        .robo-hdr-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.16);
          display: flex; align-items: center; justify-content: center;
        }
        .robo-hdr-name {
          font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 800; color: #fff;
        }
        .robo-hdr-status {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: rgba(255,255,255,0.68);
        }
        .robo-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6ee7b7; box-shadow: 0 0 4px #6ee7b7;
        }
        .robo-close {
          background: rgba(255,255,255,0.14); border: none;
          width: 26px; height: 26px; border-radius: 50%;
          color: #fff; font-size: 13px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .robo-close:hover { background: rgba(255,255,255,0.26); }

        /* messages */
        .robo-msgs {
          flex: 1; overflow-y: auto;
          padding: 12px 12px 4px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .robo-msgs::-webkit-scrollbar { width: 3px; }
        .robo-msgs::-webkit-scrollbar-thumb { background: #d8dcf0; border-radius: 3px; }

        .robo-msg-row { display: flex; gap: 7px; align-items: flex-end; }
        .robo-msg-row.user { flex-direction: row-reverse; }

        .robo-msg-icon {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          background: rgba(79,70,229,0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .robo-msg-icon.user { background: #eef0f9; font-size: 12px; }

        .robo-bubble {
          max-width: 210px; padding: 9px 12px;
          border-radius: 14px; font-size: 13px; line-height: 1.55;
        }
        .robo-bubble.ai {
          background: #eef0ff; color: #3730a3;
          border-bottom-left-radius: 4px;
        }
        .robo-bubble.user {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff; border-bottom-right-radius: 4px;
        }

        /* typing dots */
        .robo-typing { display: flex; align-items: center; gap: 3px; padding: 4px 2px; }
        .robo-typing span {
          width: 6px; height: 6px; border-radius: 50%; background: #a5b4fc;
          animation: roboTypeDot 1.2s ease-in-out infinite;
        }
        .robo-typing span:nth-child(2) { animation-delay: 0.16s; }
        .robo-typing span:nth-child(3) { animation-delay: 0.32s; }
        @keyframes roboTypeDot {
          0%,80%,100% { transform: translateY(0); opacity: 0.5; }
          40%          { transform: translateY(-5px); opacity: 1; }
        }

        /* quick actions */
        .robo-actions {
          display: flex; gap: 7px; padding: 8px 12px;
          border-top: 1px solid #eef0f9; flex-shrink: 0;
        }
        .robo-act-btn {
          flex: 1; padding: 7px 5px; border-radius: 8px;
          font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800;
          cursor: pointer; transition: all 0.15s;
        }
        .robo-act-btn.indigo {
          background: rgba(79,70,229,0.09); border: 1.5px solid rgba(79,70,229,0.2); color: #4f46e5;
        }
        .robo-act-btn.indigo:hover { background: rgba(79,70,229,0.16); border-color: rgba(79,70,229,0.4); }
        .robo-act-btn.violet {
          background: rgba(124,58,237,0.09); border: 1.5px solid rgba(124,58,237,0.2); color: #7c3aed;
        }
        .robo-act-btn.violet:hover { background: rgba(124,58,237,0.16); border-color: rgba(124,58,237,0.4); }

        /* input row */
        .robo-input-row {
          display: flex; gap: 7px; align-items: center;
          padding: 9px 12px 13px;
          border-top: 1px solid #eef0f9; flex-shrink: 0;
        }
        .robo-input {
          flex: 1; padding: 9px 12px;
          background: #f2f4fc; border: 1.5px solid #d8dcf0;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; color: #1e2235; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .robo-input::placeholder { color: #b0b9d4; }
        .robo-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.09); background: #fff;
        }
        .robo-send {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: #fff;
          box-shadow: 0 3px 10px rgba(79,70,229,0.3);
          transition: opacity 0.15s, transform 0.12s;
        }
        .robo-send:hover { opacity: 0.9; transform: translateY(-1px); }
        .robo-send:active { transform: translateY(0); }
      `}</style>

      {/* ── FAB: speech bubble + jumping robot ── */}
      <div className="robo-fab-area">

        {/* Speech bubble — hidden when chat is open */}
        {!open && (
          <div
            className={`robo-speech ${bubbleVisible ? "visible" : "hidden"}`}
            onClick={handleToggle}
          >
            {BUBBLE_MESSAGES[bubbleIdx]}
          </div>
        )}

        {/* Robot */}
        <div className="robo-body-wrap" onClick={handleToggle}>
          <div style={{ position: "relative" }}>
            <div className="robo-jump">
              <RobotSVG size={72} />
            </div>
            {unread && <div className="robo-unread" />}
          </div>
          <div className="robo-shadow" />
        </div>
      </div>

      {/* ── Chat window (opens to the left) ── */}
      {open && (
        <div className="robo-win">

          {/* Header */}
          <div className="robo-hdr">
            <div className="robo-hdr-left">
              <div className="robo-hdr-avatar">
                <RobotSVG size={28} />
              </div>
              <div>
                <div className="robo-hdr-name">AI Coach</div>
                <div className="robo-hdr-status">
                  <span className="robo-status-dot" /> Online
                </div>
              </div>
            </div>
            <button className="robo-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="robo-msgs">
            {messages.map((m, i) => (
              <div key={i} className={`robo-msg-row ${m.role}`}>
                <div className={`robo-msg-icon ${m.role}`}>
                  {m.role === "ai" ? <RobotSVG size={20} /> : "👤"}
                </div>
                <div className={`robo-bubble ${m.role}`}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="robo-msg-row ai">
                <div className="robo-msg-icon ai"><RobotSVG size={20} /></div>
                <div className="robo-bubble ai">
                  <div className="robo-typing"><span/><span/><span/></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="robo-actions">
            <button className="robo-act-btn indigo" onClick={getSuggestions}>
              📋 Suggest Tasks
            </button>
            <button className="robo-act-btn violet" onClick={getInsights}>
              📊 My Productivity
            </button>
          </div>

          {/* Input */}
          <div className="robo-input-row">
            <input
              className="robo-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
            />
            <button className="robo-send" onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIRobot;