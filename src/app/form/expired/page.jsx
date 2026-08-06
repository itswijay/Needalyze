import React from "react";
import Image from "next/image";

const ExpiredLinkPage = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <Image
          src="/images/logos/secondary-t.png"
          alt="Needalyze"
          width={96}
          height={96}
          className="mx-auto mb-4 w-24 h-auto"
          priority
        />
        <h1 className="text-2xl font-bold mb-2">Your Link has expired</h1>
        <p className="text-gray-600">Please contact support for assistance.</p>
      </div>
    </main>
  );
};

export default ExpiredLinkPage;
