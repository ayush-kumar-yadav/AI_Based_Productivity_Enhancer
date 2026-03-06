const { GoogleGenAI } = require("@google/genai");
const Task = require("../models/Task");

exports.getAIProductivitySummary = async (req, res) => {
  try {

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const tasks = await Task.find({ user: req.user.id });

    // ===== BASIC STATS =====
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const completionRate =
      totalTasks > 0
        ? Number(((completedTasks / totalTasks) * 100).toFixed(1))
        : 0;

    // ===== HIGH PRIORITY ANALYSIS =====
    const highPriorityTasks = tasks.filter(t => t.priority === "high");
    const highPriorityCompleted =
      highPriorityTasks.filter(t => t.completed).length;

    const highPriorityCompletionRate =
      highPriorityTasks.length > 0
        ? Number(
            ((highPriorityCompleted / highPriorityTasks.length) * 100).toFixed(
              1
            )
          )
        : 0;

    // ===== PRODUCTIVITY STREAK =====
    const completedDates = tasks
      .filter(t => t.completed)
      .map(t => new Date(t.updatedAt).toDateString());

    const uniqueDates = [...new Set(completedDates)].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    let streak = 0;
    let prevDate = null;

    uniqueDates.forEach(date => {
      const current = new Date(date);

      if (!prevDate) {
        streak = 1;
      } else {
        const diff = (current - prevDate) / (1000 * 60 * 60 * 24);

        if (diff === 1) streak++;
        else streak = 1;
      }

      prevDate = current;
    });

    // ===== WEEKLY TREND =====
    const trendData = {};

    tasks.forEach(task => {
      if (!task.completed) return;

      const day = new Date(task.updatedAt).toLocaleDateString("en-US", {
        weekday: "short"
      });

      trendData[day] = (trendData[day] || 0) + 1;
    });

    const trendArray = Object.keys(trendData).map(day => ({
      day,
      completed: trendData[day]
    }));


    // ===== DEFAULT FALLBACK AI =====
    let aiInsights = {
      behaviorInsight: "You are steadily completing tasks.",
      riskWarning: "Some high priority tasks remain pending.",
      strategies: [
        "Finish high priority tasks first",
        "Maintain daily consistency",
        "Break large tasks into smaller ones"
      ],
      motivation: "Small daily wins lead to big productivity gains."
    };

    let suggestions = [
      "Complete pending high priority tasks first",
      "Maintain a daily productivity streak",
      "Focus on fewer tasks at a time"
    ];


    // ===== AI PROMPTS =====
    const prompt = `
Return ONLY valid JSON:

{
 "behaviorInsight": "...",
 "riskWarning": "...",
 "strategies": ["...", "...", "..."],
 "motivation": "..."
}

Analyze this productivity data:

Total Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Pending Tasks: ${pendingTasks}
Completion Rate: ${completionRate}%
High Priority Completion Rate: ${highPriorityCompletionRate}%
`;

    const suggestionPrompt = `
Return ONLY valid JSON:

{
 "suggestions": ["...", "...", "..."]
}

Based on:

Completion Rate: ${completionRate}%
Pending Tasks: ${pendingTasks}
`;

    try {

      const response = await ai.models.generateContent({
        model: "models/gemini-2.5-flash",
        contents: prompt
      });

      const suggestionResponse = await ai.models.generateContent({
        model: "models/gemini-2.5-flash",
        contents: suggestionPrompt
      });

      // Clean AI output
      const cleanJson = text => {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const match = text.match(/\{[\s\S]*\}/);
        return match ? match[0] : "{}";
      };

      try {
        const parsed = JSON.parse(cleanJson(response.text || "{}"));
        aiInsights = parsed;
      } catch {}

      try {
        const parsedSuggestions = JSON.parse(
          cleanJson(suggestionResponse.text || "{}")
        );
        suggestions = parsedSuggestions.suggestions || suggestions;
      } catch {}

    } catch (aiError) {

      console.log("Gemini unavailable, using fallback insights");

    }

    // ===== FINAL RESPONSE =====
    res.json({
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        highPriorityCompletionRate,
        streak
      },
      trend: trendArray,
      suggestions,
      aiInsights
    });

  } catch (error) {

    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: "Analytics failed"
    });

  }
};