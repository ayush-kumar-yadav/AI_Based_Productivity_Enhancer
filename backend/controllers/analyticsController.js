const { GoogleGenAI } = require("@google/genai");
const Task = require("../models/Task");

exports.getAIProductivitySummary = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const tasks = await Task.find({ user: req.user.id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const completionRate =
      totalTasks > 0
        ? ((completedTasks / totalTasks) * 100).toFixed(1)
        : 0;

    const highPriorityTasks = tasks.filter(t => t.priority === "high");
    const highPriorityCompleted =
      highPriorityTasks.filter(t => t.completed).length;

    const highPriorityCompletionRate =
      highPriorityTasks.length > 0
        ? ((highPriorityCompleted / highPriorityTasks.length) * 100).toFixed(1)
        : 0;

    const prompt = `
Return ONLY valid JSON.

{
  "behaviorInsight": "...",
  "riskWarning": "...",
  "strategies": ["...", "...", "..."],
  "motivation": "..."
}

Analyze:

Total Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Pending Tasks: ${pendingTasks}
Completion Rate: ${completionRate}%
High Priority Completion Rate: ${highPriorityCompletionRate}%
`;

    const response = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    console.log("RAW AI:", text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        behaviorInsight: text,
        riskWarning: "Could not structure output.",
        strategies: [],
        motivation: ""
      };
    }

    res.json({
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        highPriorityCompletionRate
      },
      aiInsights: parsed
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ message: "AI analysis failed" });
  }
};