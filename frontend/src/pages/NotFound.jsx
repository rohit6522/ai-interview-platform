import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 text-center">
      <div>
        <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
        <p className="text-slate-500 mb-6">This page doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate("/")}>Go Home</Button>
      </div>
    </div>
  );
}