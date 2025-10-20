"use client";
import React from "react";
import FormContainer from "@/components/FormContainer";
import FormNavButton from "@/components/FormNavButton";
import NeedAnalysisFormHeader from "@/components/NeedAnalysisFormHeader";
import ProgressBar from "@/components/ProgressBar";

export default function Form1Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />

      <ProgressBar currentStep={1} totalSteps={4} />

      <section className="flex-grow flex justify-center pb-10 px-4 sm:px-6 lg:px-8">
        <FormContainer>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sunil Nishantha Karunarathna"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Spouse’s Name
                </label>
                <input
                  type="text"
                  placeholder="Ex: Samanthi Ishara Karunarathna"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Number of Children
                </label>
                <input
                  type="text"
                  placeholder="Ex: 3"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Occupation / Business
                </label>
                <input
                  type="text"
                  placeholder="Your Job/Business"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your Address"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Ex: +94 77 345 6489"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Age
                </label>
                <input
                  type="text"
                  placeholder="Ex: 48"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Children’s Ages
                </label>
                <input
                  type="text"
                  placeholder="Ex: 18, 13, 9"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Monthly Income (LKR)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 70,000"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10">
            <FormNavButton label="Back" type="prev" variant="gradient" />
            <FormNavButton label="Next" type="next" variant="gradient" />
          </div>
        </FormContainer>
      </section>
    </main>
  );
}
