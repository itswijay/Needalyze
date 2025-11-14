import React from "react";

const page = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <img
          src="/images/logos/secondary-t.png"
          alt="Link Expired"
          className="mx-auto mb-4 w-24 h-auto"
        />
        <h1 className="text-2xl font-bold mb-2">Your Link has expired</h1>
        <p className="text-gray-600">Please contact support for assistance.</p>
      </div>
    </main>
  );
};

export default page;
