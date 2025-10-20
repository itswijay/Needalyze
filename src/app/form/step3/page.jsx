"use client";
import React from "react";
import FormContainer from "@/components/FormContainer";
import NeedAnalysisFormHeader from "@/components/NeedAnalysisFormHeader";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";

export default function Form1Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />

      <ProgressBar currentStep={3} totalSteps={4} />

      <section className="flex-grow flex justify-center pb-10">
        <FormContainer>
            <div>
                <p className="font-bold text-2xl">Calculation of Life Cover</p>
                <p className="text-neutral-500">Enter Your Details in Following Fields</p>
            </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-10">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Fixed Monthly Expenses
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Bank Interest Rate
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div className="mt-12">
                <label className="block text-gray-700 font-bold">
                  Unsecured Bank Loan
                </label>
                <input
                  type="text"
                  placeholder="optional"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Cash In Hand + Insurance
                </label>
                <input
                  type="text"
                  placeholder="optional"
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>


            <div className="flex flex-col space-y-10 mt-16">
              <div>
                <label className="block text-gray-700 font-bold">
                  Your Human Life Value
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#7792b7] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div className="mt-24">
                <label className="block text-gray-700 font-bold mb-1">
                  Your Actual Human Life Vlue
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="border border-[#8EABD2] rounded-full px-4 py-3 bg-[#7792b7] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>
          </form>

          <div className="flex mt-10 justify-center">
            <Button className="w-32 rounded-full p-5" variant="gradient">Submit</Button>
          </div>
        </FormContainer>
      </section>
    </main>
  );
}
