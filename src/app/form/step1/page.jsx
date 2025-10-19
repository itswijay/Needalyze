"use client";
import React from "react";
import FormContainer from "@/components/FormContainer";
import NeedAnalysisFormHeader from "@/components/NeedAnalysisFormHeader";
import ProgressBar from "@/components/ProgressBar";

export default function Form1Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={1} totalSteps={4} />
      <section className="flex-grow flex justify-center pb-10">
        <FormContainer>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              {/* Left Column Inputs */}
            </div>
            <div className="flex flex-col space-y-4">
              {/* Right Column Inputs */}
            </div>
          </form>
        </FormContainer>
      </section>
    </main>
  );
}

<div className="flex flex-col space-y-4">
  <div>
    <label className="block text-gray-700 font-medium mb-1">Full Name</label>
    <input type="text" placeholder="Ex: Sunil Nishantha Karunarathna" className="border rounded-lg px-4 py-3 bg-[#DCE7F2] w-full" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
    <input type="text" placeholder="DD/MM/YYYY" className="border rounded-lg px-4 py-3 bg-[#DCE7F2] w-full" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Spouse’s Name</label>
    <input type="text" placeholder="Ex: Samanthi Ishara Karunarathna" className="border rounded-lg px-4 py-3 bg-[#DCE7F2] w-full" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Number of Children</label>
    <input type="text" placeholder="Ex: 3" className="border rounded-lg px-4 py-3 bg-[#DCE7F2] w-full" />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Occupation / Business</label>
    <input type="text" placeholder="Your Job/Business" className="border rounded-lg px-4 py-3 bg-[#DCE7F2] w-full" />
  </div>
</div>