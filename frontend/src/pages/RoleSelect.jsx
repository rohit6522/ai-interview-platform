import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { generateQuestions } from "../services/api";

const ROLES = ["SDE Fresher", "Data Analyst", "React Developer", "Product Manager"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function RoleSelect() {
  const [role, setRole] = useState(ROLES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStart = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await generateQuestions({ role, difficulty });
      // Pass questions + meta to the Interview page via navigation state
      navigate("/interview", {
        state: {
          role,
          difficulty,
          questions: res.data.questions,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "Couldn't generate questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card>
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">
            Set up your practice session
          </h1>
          <p className="text-slate-500 text-center text-sm mb-8">
            Choose a role and difficulty to get started
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* Role dropdown */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Job Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty dropdown */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 rounded-xl font-medium text-sm border-2 transition-colors ${
                    difficulty === d
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Generating your questions...
              </span>
            ) : (
              "Start Interview →"
            )}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}