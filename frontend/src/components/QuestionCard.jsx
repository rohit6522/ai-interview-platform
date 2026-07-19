import { motion } from "framer-motion";

export default function QuestionCard({ questionNumber, totalQuestions, question }) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
        {question}
      </h2>
    </motion.div>
  );
}