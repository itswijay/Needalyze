"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

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
  
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      fullName: "",
      dateOfBirth: null,
      spouseName: "",
      numChildren: "",
      occupation: "",
      address: "",
      phoneNumber: "",
      age: "",
      childrenAges: "",
      income: "",
    },
  });

  const date = watch("dateOfBirth");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") setOpen(false);
    },
    [setOpen]
  );

  useEffect(() => {
    if (!mounted) return;
    if (open) window.addEventListener("keydown", onKeyDown);
    else window.removeEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, mounted, onKeyDown]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    router.push("/form/step2");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={1} totalSteps={4} />

      <section className="flex-grow flex justify-center items-center py-8 px-4">
        <FormContainer>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm"
          >
            {/* Left Column */}
            <div className="flex flex-col space-y-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Ex: Sunil Nishantha Karunarathna"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    readOnly
                    value={date ? format(date, "dd/MM/yyyy") : ""}
                    placeholder="DD/MM/YYYY"
                    className="border border-[#8EABD2] rounded-full px-3 py-2 pr-10 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2] cursor-pointer"
                    onClick={() => setOpen(true)}
                  />

                  <Popover open={open && !isMobile} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 bg-transparent hover:bg-transparent"
                        onClick={() => setOpen((s) => !s)}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0 mt-2 border border-gray-200 rounded-xl shadow-lg"
                      side="bottom"
                      align="center"
                      sideOffset={4}
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setValue("dateOfBirth", d);
                          setOpen(false);
                        }}
                        fromYear={1950}
                        toYear={2025}
                        captionLayout="dropdown"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Mobile Calendar */}
                  {mounted && isMobile && open && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center"
                      aria-modal="true"
                      role="dialog"
                    >
                      <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                      />
                      <div className="relative z-50 bg-white rounded-2xl p-3 shadow-lg border border-gray-200">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => {
                            setValue("dateOfBirth", d);
                            setOpen(false);
                          }}
                          fromYear={1950}
                          toYear={2025}
                          captionLayout="dropdown"
                          initialFocus
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Spouse’s Name
                </label>
                <input
                  {...register("spouseName")}
                  type="text"
                  placeholder="Ex: Samanthi Ishara Karunarathna"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Number of Children
                </label>
                <input
                  {...register("numChildren")}
                  type="text"
                  placeholder="Ex: 3"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Occupation / Business
                </label>
                <input
                  {...register("occupation")}
                  type="text"
                  placeholder="Your Job/Business"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  {...register("address")}
                  type="text"
                  placeholder="Your Address"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber")}
                  type="text"
                  placeholder="Ex: +94 77 345 6489"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Age
                </label>
                <input
                  {...register("age")}
                  type="text"
                  placeholder="Ex: 48"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Children’s Ages
                </label>
                <input
                  {...register("childrenAges")}
                  type="text"
                  placeholder="Ex: 18, 13, 9"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Monthly Income (LKR)
                </label>
                <input
                  {...register("income")}
                  type="text"
                  placeholder="Ex: 70,000"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none focus:ring-2 focus:ring-[#8EABD2]"
                />
              </div>
            </div>
          </form>

          <div className="flex justify-between items-center mt-6">
            <FormNavButton
              label="Back"
              type="prev"
              variant="gradient"
              disabled
            />
            <FormNavButton
              label="Next"
              type="next"
              variant="gradient"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </FormContainer>
      </section>
    </main>
  );
}
