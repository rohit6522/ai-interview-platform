import { pool } from "../config/db.js";

// Save a completed session (role, difficulty, questions, answers, scores)
export const saveSession = async (req, res) => {
  const userId = req.userId; // set by verifyToken middleware
  const { role, difficulty, questions } = req.body;
  // questions = [{ question_text, answer_text, score, strengths, improvements }, ...]

  if (!role || !difficulty || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "role, difficulty, and questions[] are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const avgScore =
      questions.reduce((sum, q) => sum + Number(q.score || 0), 0) / questions.length;

    const sessionResult = await client.query(
      `INSERT INTO sessions (user_id, role, difficulty, average_score)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, role, difficulty, avgScore.toFixed(2)]
    );

    const sessionId = sessionResult.rows[0].id;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await client.query(
        `INSERT INTO session_questions
         (session_id, question_text, answer_text, score, strengths, improvements, question_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [sessionId, q.question_text, q.answer_text, q.score, q.strengths, q.improvements, i + 1]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ sessionId, averageScore: avgScore.toFixed(2) });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to save session" });
  } finally {
    client.release();
  }
};

// Get all sessions for the logged-in user (for dashboard)
export const getUserSessions = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT id, role, difficulty, average_score, created_at
       FROM sessions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ sessions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// Get full detail of one session (questions + answers + feedback)
export const getSessionDetail = async (req, res) => {
  const userId = req.userId;
  const { sessionId } = req.params;

  try {
    const sessionCheck = await pool.query(
      "SELECT * FROM sessions WHERE id = $1 AND user_id = $2",
      [sessionId, userId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const questions = await pool.query(
      `SELECT question_text, answer_text, score, strengths, improvements, question_order
       FROM session_questions
       WHERE session_id = $1
       ORDER BY question_order ASC`,
      [sessionId]
    );

    res.json({ session: sessionCheck.rows[0], questions: questions.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch session detail" });
  }
};