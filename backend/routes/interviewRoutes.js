import express from "express";
import { generateQuestions, evaluateAnswer } from "../controllers/interviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-questions", verifyToken, generateQuestions);
router.post("/evaluate-answer", verifyToken, evaluateAnswer);

export default router;