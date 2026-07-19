import { geminiModel } from "../config/gemini.js";
import { fallbackQuestions } from "../config/fallbackQuestions.js";

export const generateQuestions = async (req, res) => {
  const { role, difficulty } = req.body;

  if (!role || !difficulty) {
    return res.status(400).json({ error: "Role and difficulty are required" });
  }

  const prompt = `Generate 5 technical interview questions for a ${role} position at ${difficulty} level. Return ONLY a valid JSON array of strings, no markdown, no explanation. Example format: ["question 1", "question 2", "question 3", "question 4", "question 5"]`;

  try {
    const result = await geminiModel.generateContent(prompt);
    let text = result.response.text().trim();

    // Gemini sometimes wraps output in ```json ... ``` — strip that
    text = text.replace(/```json|```/g, "").trim();

    const questions = JSON.parse(text);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid AI response format");
    }

    res.json({ questions, source: "ai" });
  } catch (err) {
    console.error("Gemini error, using fallback:", err.message);

    // fallback to hardcoded questions
    const fallback = fallbackQuestions[role]?.[difficulty];

    if (fallback) {
      return res.json({ questions: fallback, source: "fallback" });
    }

    res.status(500).json({ error: "Failed to generate questions and no fallback available" });
  }
};