import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FormNavButton = ({
  label,
  type,
  variant = "default",
  onClick,
  disabled = false,
}) => {
  const baseClasses = "px-6 py-2 rounded-md font-medium transition-all";
  const gradientClasses = disabled
    ? "bg-gray-300 text-gray-500 cursor-not-allowed rounded-full py-1"
    : "bg-[var(--primary-200)] rounded-full py-2";

  return (
    <div>
      {type === "prev" ? (
        <Button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`flex items-center  ${baseClasses} ${
            variant === "gradient" ? gradientClasses : ""
          }`}
        >
          <ArrowLeft className="mr-1 w-4 h-4" />
          {label}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`flex items-center  ${baseClasses} ${
            variant === "gradient" ? gradientClasses : ""
          }`}
        >
          {label}

          <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default FormNavButton;
