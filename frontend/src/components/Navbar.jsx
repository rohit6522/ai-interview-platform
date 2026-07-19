import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
      <span
        className="text-xl font-bold text-teal-700 cursor-pointer"
        onClick={() => navigate(user ? "/dashboard" : "/")}
      >
        InterviewAI
      </span>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 hidden sm:block">Hi, {user.name}</span>
          <Button variant="ghost" onClick={handleLogout}>
            <span className="flex items-center gap-1.5">
              <LogOut size={16} /> Logout
            </span>
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/login")}>Log In</Button>
          <Button variant="primary" onClick={() => navigate("/signup")}>Sign Up</Button>
        </div>
      )}
    </nav>
  );
}