import { useState } from "react";
import API from "../../api/axios";

function AIRobot() {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your productivity coach 🤖" }
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  // ===== Get ranked tasks =====
  const getSuggestions = async () => {

  if (loading) return;

  try {

    setLoading(true);

    const res = await API.get("/analytics/rank-tasks");

    const ranked = res.data.rankedTasks;

    setMessages(prev => [
      ...prev,
      { role: "ai", text: "Here are your most important tasks:" },
      { role: "ai", text: ranked.join(", ") }
    ]);

  } catch {

    setMessages(prev => [
      ...prev,
      { role: "ai", text: "Unable to analyze tasks." }
    ]);

  }

  setLoading(false);
};


  // ===== Get AI insights =====
  const getInsights = async () => {

    try {

      setLoading(true);

      const res = await API.get("/analytics/ai-summary");

      const insight = res.data.aiInsights?.behaviorInsight;

      setMessages(prev => [
        ...prev,
        { role: "ai", text: insight || "Your productivity looks steady." }
      ]);

      setLoading(false);

    } catch {

      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Unable to fetch insights." }
      ]);

      setLoading(false);

    }
  };


  // ===== Chat input =====
  const sendMessage = () => {

    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { role: "user", text: input }
    ]);

    // simple rule responses
    if (input.toLowerCase().includes("what should i do")) {
      getSuggestions();
    } else if (input.toLowerCase().includes("productivity")) {
      getInsights();
    } else {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Try asking about tasks or productivity." }
      ]);
    }

    setInput("");

  };


  return (
    <>
      {/* Floating Robot */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer"
      >
        🤖
      </div>


      {/* Chat Window */}
      {open && (

        <div className="fixed bottom-24 right-6 w-80 h-[420px] bg-white rounded-xl shadow-xl flex flex-col">

          {/* Header */}
          <div className="bg-purple-600 text-white p-3 rounded-t-xl font-semibold">
            AI Productivity Coach
          </div>


          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">

            {messages.map((m, i) => (
              <div key={i} className={m.role === "ai" ? "text-purple-700" : "text-gray-800"}>
                <b>{m.role === "ai" ? "AI" : "You"}:</b> {m.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-500">Analyzing...</div>
            )}

          </div>


          {/* Quick Actions */}
          <div className="flex gap-2 p-2 border-t">

            <button
              onClick={getSuggestions}
              className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
            >
              Suggest Tasks
            </button>

            <button
              onClick={getInsights}
              className="text-xs bg-gray-600 text-white px-2 py-1 rounded"
            >
              Productivity
            </button>

          </div>


          {/* Input */}
          <div className="flex border-t p-2">

            <input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />

            <button
              onClick={sendMessage}
              className="ml-2 bg-purple-600 text-white px-3 rounded"
            >
              Send
            </button>

          </div>

        </div>

      )}

    </>
  );
}

export default AIRobot;