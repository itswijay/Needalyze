"use client";

import Cards from "./components/Cards";
import { DataTable } from "./components/Dashtable";
import Navbar from "./components/Navbar";
import CreateLinkDialog from "./components/CreateLinkDialog";
import { useState } from "react";

const page = () => {
  const [cardData, setCardData] = useState({
    completedForms: 40,
    inProgress: 10,
    categories: {
      health: 8,
      education: 12,
      pensionfund: 15,
      DependentsCostofLiving: 8,
      longTermSavings: 3,
      shortTermSavings: 5,
    },
  });
  return (
    <div className="bg-[var(--primary-50)]/4">
      <div className="min-h-screen max-w-7xl p-4 mx-auto  ">
        <Navbar />
        <Cards cardData={cardData} />
        <div className=" flex justify-end my-4">
          <CreateLinkDialog />
        </div>
        <DataTable />
      </div>
    </div>
  );
};

export default page;
