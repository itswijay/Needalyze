import React from "react";
import Image from "next/image";

const InvalidLinkPage = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <Image
          src="/images/invalid.png"
          alt=""
          width={48}
          height={48}
          className="mx-auto mb-4 w-12 h-auto"
          priority
        />
        <h1 className="text-2xl font-bold mb-2">Invalid Form Link</h1>
        <p className="text-gray-600">Please check the link and try again.</p>
      </div>
    </main>
  );
};

export default InvalidLinkPage;
