import React from "react";

export default function FormContainer({ title, children, className = "" }) {
  return (
    <div
      className={`bg-white shadow-xl rounded-3xl p-10 sm:p-14 w-full max-w-5xl mx-auto ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          {title}
        </h2>
      )}
      <div>{children}</div>
    </div>
  );
}
