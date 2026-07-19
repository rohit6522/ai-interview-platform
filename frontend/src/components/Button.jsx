import { motion } from "framer-motion";

export default function Button({ children, onClick, variant = "primary", type = "button", disabled = false, className = "" }) {
  const base = "px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700",
    secondary: "bg-white text-teal-700 border-2 border-teal-600 hover:bg-teal-50",
    ghost: "text-slate-600 hover:text-teal-700",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}