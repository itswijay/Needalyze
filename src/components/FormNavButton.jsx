import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function FormNavButton({
  label,
  type = "next",
  onClick,
  className = "",
}) {
  const isNext = type === "next";

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full 
        bg-gradient-to-r from-blue-700 to-blue-500 text-white font-medium 
        shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 
        ${isNext ? "flex-row" : "flex-row-reverse"} ${className}`}
    >
      {isNext ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
      {label}
    </button>
  );
}
