import express from "express";
import { generateQuestions } from "../controllers/interviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate-questions", verifyToken, generateQuestions);

export default router;