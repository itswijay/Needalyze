import React from "react";

export default function FormContainer({ title, children, className = "" }) {
  return (
    <div
      className={`
        bg-white shadow-xl rounded-3xl 
        p-6 sm:p-10 md:p-14 
        w-full max-w-4xl 
        mx-auto 
        -mt-6 sm:-mt-10 
        ${className}
        flex flex-col
        min-h-[80vh] sm:min-h-0
      `}
    >
      {title && (
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 sm:mb-8">
          {title}
        </h2>
      )}
      <div className="flex-grow">{children}</div>
    </div>
  );
}