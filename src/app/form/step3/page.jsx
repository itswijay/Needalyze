"use client";
import React from "react";
import FormContainer from "@/components/FormContainer";
import NeedAnalysisFormHeader from "@/components/NeedAnalysisFormHeader";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";

export default function Form3Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={3} totalSteps={4} />

      <section className="flex-grow flex justify-center items-start py-6 px-4">
        <FormContainer>
          <div className="mb-6">
            <p className="font-bold text-2xl">Calculation of Life Cover</p>
            <p className="text-neutral-500">
              Enter Your Details in the Following Fields
            </p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm">
            {/* Left column */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Fixed Monthly Expenses
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Bank Interest Rate
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Unsecured Bank Loan
                </label>
                <input
                  type="text"
                  placeholder="optional"
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Cash In Hand + Insurance
                </label>
                <input
                  type="text"
                  placeholder="optional"
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Your Human Life Value
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#7792b7] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Your Actual Human Life Value
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-2 bg-[#7792b7] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>
          </form>

          {/* Submit button */}
          <div className="flex mt-8 justify-center">
            <Button className="w-32 rounded-full py-3" variant="gradient">
              Submit
            </Button>
          </div>
        </FormContainer>
      </section>
    </main>
  );
}
