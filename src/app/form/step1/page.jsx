"use client";
import React from "react";
import FormContainer from "@/components/FormContainer";
import NeedAnalysisFormHeader from "@/components/NeedAnalysisFormHeader";
import ProgressBar from "@/components/ProgressBar";

export default function Form1Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <NeedAnalysisFormHeader />

      {/* Progress Bar */}
      <ProgressBar currentStep={1} totalSteps={4} />

      {/* Form Section */}
      <section className="flex-grow flex justify-center pb-10">
        <FormContainer>
          {/* Form will go here later */}
        </FormContainer>
      </section>
    </main>
  );
}
