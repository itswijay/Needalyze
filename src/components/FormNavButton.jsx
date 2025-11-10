import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FormNavButton = ({
  label,
  type,
  variant = "gradient",
  onClick,
  disabled = false,
}) => {
  const baseClasses = "px-6 py-2 rounded-md font-medium transition-all";
  const gradientClasses = disabled
    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    : "bg-gradient-to-r from-[#3EAA66] to-[#189370] text-white hover:opacity-90";

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${
        variant === "gradient" ? gradientClasses : ""
      }`}
    >
      {label}
    </Button>
  );
};

export default FormNavButton;
