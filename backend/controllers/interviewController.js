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


export const evaluateAnswer = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }

  const prompt = `Question: ${question}
Candidate's answer: ${answer}

Rate this answer from 0-10 based on correctness, clarity, and confidence. Return ONLY valid JSON in this exact format, no markdown, no explanation:
{"score": <number 0-10>, "strengths": "<1-2 sentences>", "improvements": "<1-2 sentences>"}`;

  try {
    const result = await geminiModel.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json|```/g, "").trim();

    const feedback = JSON.parse(text);

    if (typeof feedback.score !== "number") {
      throw new Error("Invalid AI response format");
    }

    res.json({ ...feedback, source: "ai" });
  } catch (err) {
    console.error("Gemini evaluation error, using fallback:", err.message);

    // simple fallback scoring so the demo never breaks
    const fallbackScore = answer.trim().length > 50 ? 6 : 3;
    res.json({
      score: fallbackScore,
      strengths: "You attempted a relevant answer with reasonable structure.",
      improvements: "Try to add more specific technical detail and examples.",
      source: "fallback",
    });
  }
};