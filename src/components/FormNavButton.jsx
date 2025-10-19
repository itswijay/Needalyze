import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function FormNavButton({
  label,
  type = "next",
  onClick,
  variant = "default",
  className = "",
}) {
  const isNext = type === "next"

  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={`flex items-center justify-center rounded-full w-32 h-13 ${className}`}
    >
      {isNext ? (
        <>
          {label}
          <ArrowRight size={18} className="ml-1" />
        </>
      ) : (
        <>
          <ArrowLeft size={18} className="mr-1" />
          {label}
        </>
      )}
    </Button>
  )
}
