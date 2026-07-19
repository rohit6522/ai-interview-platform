import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, MicOff, Loader2, Send } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import QuestionCard from "../components/QuestionCard";
import ScoreCard from "../components/ScoreCard";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { evaluateAnswer, saveSession } from "../services/api";

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, difficulty, questions } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionResults, setSessionResults] = useState([]);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  // Redirect back if someone lands here directly without state (e.g. refresh)
  if (!questions || questions.length === 0) {
    navigate("/select-role");
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      setAnswer((prev) => (prev + " " + transcript).trim());
      resetTranscript();
    } else {
      startListening();
    }
  };

  const handleSubmit = async () => {
    const finalAnswer = (answer + " " + transcript).trim();

    if (!finalAnswer) {
      setError("Please type or speak an answer before submitting.");
      return;
    }

    if (isListening) stopListening();
    setError("");
    setLoading(true);

    try {
      const res = await evaluateAnswer({ question: currentQuestion, answer: finalAnswer });
      setFeedback(res.data);
      setSessionResults((prev) => [
        ...prev,
        {
          question_text: currentQuestion,
          answer_text: finalAnswer,
          score: res.data.score,
          strengths: res.data.strengths,
          improvements: res.data.improvements,
        },
      ]);
    } catch (err) {
      setError("Couldn't evaluate your answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Save the full session, then go to summary
      try {
        const res = await saveSession({ role, difficulty, questions: sessionResults });
        navigate("/summary", {
          state: { sessionResults, averageScore: res.data.averageScore },
        });
      } catch {
        // even if save fails, still show the summary so the demo doesn't break
        const avg =
          sessionResults.reduce((sum, q) => sum + Number(q.score), 0) / sessionResults.length;
        navigate("/summary", { state: { sessionResults, averageScore: avg.toFixed(2) } });
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setAnswer("");
    resetTranscript();
    setFeedback(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
          <motion.div
            className="bg-teal-600 h-2 rounded-full"
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <Card className="mb-6">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentIndex}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              question={currentQuestion}
            />
          </AnimatePresence>

          {!feedback && (
            <div className="mt-6">
              <textarea
                value={isListening ? (answer + " " + transcript).trim() : answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here, or use the mic..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex items-center justify-between mt-4">
                {isSupported ? (
                  <button
                    onClick={handleMicToggle}
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      isListening
                        ? "bg-red-50 text-red-600 animate-pulse"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    {isListening ? "Stop Recording" : "Speak Answer"}
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">
                    Voice input not supported in this browser
                  </span>
                )}

                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Evaluating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Submit Answer
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {feedback && (
          <>
            <ScoreCard
              score={feedback.score}
              strengths={feedback.strengths}
              improvements={feedback.improvements}
            />
            <div className="flex justify-end mt-6">
              <Button variant="primary" onClick={handleNext}>
                {isLastQuestion ? "Finish Session →" : "Next Question →"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}