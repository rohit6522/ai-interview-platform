import express from "express";
import { saveSession, getUserSessions, getSessionDetail } from "../controllers/sessionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, saveSession);
router.get("/", verifyToken, getUserSessions);
router.get("/:sessionId", verifyToken, getSessionDetail);

export default router;