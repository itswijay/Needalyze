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
