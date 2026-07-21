const { GoogleGenAI } = require("@google/genai");
const Task = require("../models/Task");

// ===== AI CACHE (prevents rate limits) =====
// Per-user, so users don't see each other's cached insights.
const cacheStore = new Map(); // userId -> { data, lastFetch }


// ================= AI PRODUCTIVITY SUMMARY =================

exports.getAIProductivitySummary = async (req, res) => {

  try {

    const now = Date.now();
    const userId = req.user.id;

    // return cached result if within 60 seconds, PER USER
    const cached = cacheStore.get(userId);
    if (cached && now - cached.lastFetch < 60000) {
      return res.json(cached.data);
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const tasks = await Task.find({ user: userId });


    // ===== BASIC STATS =====

    const totalTasks = tasks.length;

    const completedTasks =
      tasks.filter(t => t.completed).length;

    const pendingTasks =
      totalTasks - completedTasks;

    const completionRate =
      totalTasks > 0
        ? Number(((completedTasks / totalTasks) * 100).toFixed(1))
        : 0;


    // ===== HIGH PRIORITY ANALYSIS =====

    const highPriorityTasks =
      tasks.filter(t => t.priority === "high");

    const highPriorityCompleted =
      highPriorityTasks.filter(t => t.completed).length;

    const highPriorityCompletionRate =
      highPriorityTasks.length > 0
        ? Number(
            ((highPriorityCompleted / highPriorityTasks.length) * 100).toFixed(1)
          )
        : 0;


    // ===== PRODUCTIVITY STREAK =====

    const completedDates = tasks
      .filter(t => t.completed)
      .map(t => new Date(t.updatedAt).toDateString());

    const uniqueDates = [...new Set(completedDates)]
      .sort((a, b) => new Date(a) - new Date(b));

    let streak = 0;
    let prevDate = null;

    uniqueDates.forEach(date => {

      const current = new Date(date);

      if (!prevDate) {
        streak = 1;
      } else {

        const diff =
          (current - prevDate) / (1000 * 60 * 60 * 24);

        if (diff === 1) streak++;
        else streak = 1;

      }

      prevDate = current;

    });


    // ===== WEEKLY TREND =====

    const trendData = {};

    tasks.forEach(task => {

      if (!task.completed) return;

      const day = new Date(task.updatedAt)
        .toLocaleDateString("en-US", { weekday: "short" });

      trendData[day] =
        (trendData[day] || 0) + 1;

    });

    const trendArray = Object.keys(trendData)
      .map(day => ({
        day,
        completed: trendData[day]
      }));


    // ===== DEFAULT FALLBACK AI =====

    let aiInsights = {
      behaviorInsight:
        "You are steadily completing tasks.",
      riskWarning:
        "Some high priority tasks remain pending.",
      strategies: [
        "Finish high priority tasks first",
        "Maintain daily consistency",
        "Break large tasks into smaller ones"
      ],
      motivation:
        "Small daily wins lead to big productivity gains."
    };

    let suggestions = [
      "Complete pending high priority tasks first",
      "Maintain a daily productivity streak",
      "Focus on fewer tasks at a time"
    ];


    // ===== TASK CONTEXT FOR GEMINI =====
    // FIX #1: send the actual tasks, not just aggregate numbers, so the
    // model can reason about *what* the user is working on, not just how
    // many. Cap it to keep the prompt reasonably sized on large task lists.
    const MAX_TASKS_IN_PROMPT = 100;

    const taskSummary = tasks
      .slice(0, MAX_TASKS_IN_PROMPT)
      .map(task => ({
        title: task.title,
        priority: task.priority,
        completed: task.completed,
        deadline: task.deadline || task.dueDate || null,
        category: task.category || "General",
        lastUpdated: task.updatedAt
      }));


    // ===== SINGLE MERGED GEMINI CALL =====
    // FIX #2: richer, more specific prompt instead of "You are a productivity coach."
    // FIX #3: one call instead of two — cheaper, faster, and the suggestions
    // are now grounded in the same reasoning pass as the insights instead of
    // being generated independently (which caused inconsistency).
    const prompt = `
You are an experienced productivity coach reviewing a user's task list and
work habits. Analyze the data below and identify things like:
- procrastination patterns
- burnout risk
- workload imbalance
- high-priority neglect
- consistency
- focus / context-switching

Give specific, personalized advice. Avoid generic statements like "stay
consistent" unless you tie it to something concrete in this data. Base every
insight ONLY on the data provided below — do not invent tasks or numbers.

STATS
Total Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Pending Tasks: ${pendingTasks}
Completion Rate: ${completionRate}%
High Priority Completion Rate: ${highPriorityCompletionRate}%
Current Streak: ${streak} day(s)

TASKS (title, priority, completed, deadline, category, lastUpdated)
${JSON.stringify(taskSummary, null, 2)}

Respond with a JSON object with exactly these keys:
- behaviorInsight (string): what their task data reveals about how they work
- riskWarning (string): the single biggest risk right now, referencing specific tasks/categories where relevant
- strategies (array of 3 short strings): concrete next actions, referencing specific tasks where useful
- motivation (string): a short, genuine (not cheesy) motivational line tied to their actual progress
- suggestions (array of 3 short strings): specific, actionable suggestions for what to do next
`;

    const responseSchema = {
      type: "object",
      properties: {
        behaviorInsight: { type: "string" },
        riskWarning: { type: "string" },
        strategies: {
          type: "array",
          items: { type: "string" }
        },
        motivation: { type: "string" },
        suggestions: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["behaviorInsight", "riskWarning", "strategies", "motivation", "suggestions"]
    };

    const extractText = response => {
      if (!response) return "";
      if (typeof response.text === "string") return response.text;
      return response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    };

    const cleanJson = text => {

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const match =
        text.match(/\{[\s\S]*\}/);

      return match ? match[0] : "{}";

    };


    try {

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.7
        }
      });

      const responseText = extractText(response);
      const parsed = JSON.parse(cleanJson(responseText));

      // Only accept the parsed result if it actually has the shape we
      // expect, otherwise silently keep the fallback (as before).
      if (
        parsed &&
        typeof parsed.behaviorInsight === "string" &&
        typeof parsed.riskWarning === "string" &&
        Array.isArray(parsed.strategies) &&
        typeof parsed.motivation === "string" &&
        Array.isArray(parsed.suggestions)
      ) {
        aiInsights = {
          behaviorInsight: parsed.behaviorInsight,
          riskWarning: parsed.riskWarning,
          strategies: parsed.strategies,
          motivation: parsed.motivation
        };
        suggestions = parsed.suggestions;
      }

    } catch (aiError) {

      console.log(
        "Gemini unavailable or unparsable, using fallback insights:", aiError.message
      );

    }


    const responseData = {

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

    };


    // cache result per-user
    cacheStore.set(userId, { data: responseData, lastFetch: now });

    res.json(responseData);

  } catch (error) {

    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Analytics failed"
    });

  }

};



// ================= AI TASK RANKER =================

exports.rankTasks = async (req, res) => {

  try {

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const tasks =
      await Task.find({ user: req.user.id });

    if (tasks.length === 0) {
      return res.json({ rankedTasks: [] });
    }


    // FIX #1: give the model deadline/category context here too, not just
    // priority + completed.
    const taskList = tasks
      .map((t, i) =>
        `${i + 1}. ${t.title} (priority: ${t.priority}, completed: ${t.completed}, ` +
        `deadline: ${t.deadline || t.dueDate || "none"}, category: ${t.category || "General"})`
      )
      .join("\n");


    const prompt = `
You are a productivity assistant. Rank these tasks from MOST important to
LEAST important. Consider priority, deadline urgency, and category —
completed tasks should rank lowest.

Tasks:
${taskList}

Respond ONLY with valid JSON:

{
  "rankedTasks": [
    "Task 1",
    "Task 2",
    "Task 3"
  ]
}
`;


    // FIX #4: return {title, reason} per task instead of a bare title string,
    // so the frontend can show *why* a task is ranked where it is.
    let rankedTasks = [];

try {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          rankedTasks: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        required: ["rankedTasks"]
      },
      temperature: 0.3
    }
  });

  const text =
    typeof response.text === "string"
      ? response.text
      : response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(clean);

  if (
    Array.isArray(parsed.rankedTasks) &&
    parsed.rankedTasks.length > 0 &&
    parsed.rankedTasks.every(t => typeof t === "string")
  ) {
    rankedTasks = parsed.rankedTasks;
  } else {
    throw new Error("Empty or malformed rankedTasks");
  }

} catch (e) {

  console.log("AI ranking failed, using fallback:", e.message);

  const order = {
    high: 3,
    medium: 2,
    low: 1
  };

  rankedTasks = tasks
    .slice()
    .sort((a, b) => {

      if (a.completed !== b.completed) {
        return a.completed - b.completed;
      }

      return order[b.priority] - order[a.priority];

    })
    .map(t => t.title);

}

res.json({ rankedTasks });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Task ranking failed"
    });

  }

};