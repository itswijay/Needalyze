"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import FormContainer from "@/components/FormContainer";
import FormNavButton from "@/components/FormNavButton";
import NeedAnalysisFormHeader from "@/components/NeedAnalysisFormHeader";
import ProgressBar from "@/components/ProgressBar";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Form1Page() {
  const router = useRouter();
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    router.push("/form/step2");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={1} totalSteps={4} />

      <section className="flex-grow flex justify-center pb-10 px-4 sm:px-6 lg:px-8">
        <FormContainer>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                <div className="relative">
                  <input
                    readOnly
                    value={date ? format(date, "dd/MM/yyyy") : ""}
                    placeholder="DD/MM/YYYY"
                    className="border border-[#8EABD2] rounded-full px-4 py-3 pr-12 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2] cursor-pointer"
                    onClick={() => setOpen(true)}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                        onClick={() => setOpen(!open)}
                      >
                        <CalendarIcon className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          setOpen(false);
                        }}
                        fromYear={1950}
                        toYear={2025}
                        captionLayout="dropdown" 
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
            <FormNavButton
              label="Back"
              type="prev"
              variant="gradient"
              onClick={() => router.back()}
            />
            <FormNavButton
              label="Next"
              type="next"
              variant="gradient"
              onClick={handleNext}
            />
          </div>
        </FormContainer>
      </section>
    </main>
  );
}
