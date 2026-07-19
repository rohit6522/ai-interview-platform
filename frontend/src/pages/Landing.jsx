import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Brain, BarChart3 } from "lucide-react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Generated Questions",
      desc: "Get role-specific interview questions tailored to your experience level.",
    },
    {
      icon: Mic,
      title: "Speak or Type",
      desc: "Answer naturally by voice or text — practice like a real interview.",
    },
    {
      icon: BarChart3,
      title: "Track Your Progress",
      desc: "See your scores improve over time with detailed session history.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <span className="text-xl font-bold text-teal-700">InterviewAI</span>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Log In
          </Button>
          <Button variant="primary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
          Ace Your Next Interview <br />
          <span className="text-teal-600">with AI Practice</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Practice technical interviews for any role, get instant AI feedback on
          your answers, and track your improvement over time — all for free.
        </p>
        <div className="mt-10">
          <Button
            variant="primary"
            className="text-lg px-8 py-4"
            onClick={() => navigate("/signup")}
          >
            Get Started →
          </Button>
        </div>
      </motion.section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <Card className="h-full text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <f.icon className="text-teal-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}