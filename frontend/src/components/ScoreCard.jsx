import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";

export default function ScoreCard({ score, strengths, improvements }) {
  const getScoreColor = (s) => {
    if (s >= 7) return "text-green-600 bg-green-50";
    if (s >= 4) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Feedback</h3>
        <div className={`text-lg font-bold px-4 py-1.5 rounded-full ${getScoreColor(score)}`}>
          {score}/10
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <CheckCircle2 className="text-teal-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-slate-700">Strengths</p>
            <p className="text-sm text-slate-500 mt-0.5">{strengths}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <TrendingUp className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-slate-700">Areas to Improve</p>
            <p className="text-sm text-slate-500 mt-0.5">{improvements}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}