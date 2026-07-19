import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, PlusCircle, LogOut } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { getUserSessions } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getUserSessions();
        setSessions(res.data.sessions);
      } catch {
        setError("Couldn't load your session history.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Recharts needs oldest → newest for a left-to-right progress line
  const chartData = [...sessions]
    .reverse()
    .map((s, i) => ({
      name: `#${i + 1}`,
      score: Number(s.average_score),
      role: s.role,
    }));

  const overallAvg =
    sessions.length > 0
      ? (sessions.reduce((sum, s) => sum + Number(s.average_score), 0) / sessions.length).toFixed(2)
      : "—";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-teal-700">InterviewAI</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 hidden sm:block">Hi, {user?.name}</span>
          <Button variant="ghost" onClick={handleLogout}>
            <span className="flex items-center gap-1.5">
              <LogOut size={16} /> Logout
            </span>
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Your Progress</h1>
            <p className="text-slate-500 text-sm mt-1">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} completed
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate("/select-role")}>
            <span className="flex items-center gap-2">
              <PlusCircle size={16} />
              New Session
            </span>
          </Button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-teal-600" size={32} />
          </div>
        ) : error ? (
          <Card className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : sessions.length === 0 ? (
          <Card className="text-center py-16">
            <p className="text-slate-500 mb-4">You haven't completed any sessions yet.</p>
            <Button variant="primary" onClick={() => navigate("/select-role")}>
              Start Your First Interview
            </Button>
          </Card>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                  Overall Average
                </p>
                <p className="text-3xl font-bold text-teal-600">{overallAvg}</p>
              </Card>
              <Card>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                  Sessions Completed
                </p>
                <p className="text-3xl font-bold text-slate-800">{sessions.length}</p>
              </Card>
              <Card>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                  Latest Score
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {sessions[0]?.average_score}
                </p>
              </Card>
            </div>

            {/* Chart */}
            <Card className="mb-6">
              <h3 className="font-semibold text-slate-700 mb-4">Score Trend</h3>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{ fill: "#0d9488", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Session history table */}
            <Card>
              <h3 className="font-semibold text-slate-700 mb-4">Session History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-100">
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Difficulty</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s.id} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 text-slate-700">{s.role}</td>
                        <td className="py-3 text-slate-500">{s.difficulty}</td>
                        <td className="py-3 font-semibold text-teal-600">
                          {s.average_score}/10
                        </td>
                        <td className="py-3 text-slate-400">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}