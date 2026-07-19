import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, RotateCcw, LayoutDashboard } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Summary() {
const location = useLocation();
  const navigate = useNavigate();
  const { sessionResults, averageScore } = location.state || {};

  if (!sessionResults) {
    navigate("/select-role");
    return null;
  }

  const getScoreMessage = (score) => {
    if (score >= 8) return "Excellent work! You're interview-ready.";
    if (score >= 6) return "Good job! A bit more practice and you'll be solid.";
    if (score >= 4) return "Decent start — focus on the improvement areas below.";
    return "Keep practicing — everyone starts somewhere!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4"
            >
              <Trophy className="text-teal-600" size={28} />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Session Complete!</h1>
            <p className="text-slate-500 text-sm mb-6">{getScoreMessage(averageScore)}</p>

            <div className="text-5xl font-bold text-teal-600 mb-1">{averageScore}</div>
            <p className="text-slate-400 text-sm mb-8">Average Score out of 10</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" onClick={() => navigate("/select-role")}>
                <span className="flex items-center gap-2">
                  <RotateCcw size={16} />
                  Practice Again
                </span>
              </Button>
              <Button variant="primary" onClick={() => navigate("/dashboard")}>
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  View Dashboard
                </span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Question breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">
            Question Breakdown
          </h2>
          <div className="space-y-3">
            {sessionResults.map((q, i) => (
              <Card key={i}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-slate-700 font-medium flex-1">
                    {i + 1}. {q.question_text}
                  </p>
                  <span className="text-sm font-bold text-teal-600 shrink-0">
                    {q.score}/10
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}