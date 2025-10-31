"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

// Form validation schema using Zod
const formSchema = z
  .object({
    // Full name validation
    fullName: z.string().min(1, "Full name is required"),

    // Date of birth validation
    dateOfBirth: z.date({ required_error: "Date of birth is required" }),

    // Optional spouse name
    spouseName: z.string().optional(),

    // Address validation
    address: z.string().min(1, "Address is required"),

    // Phone number validation
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^\+\d{11}$/,
        "Phone number must be with valid country code (e.g. +94771234567 for Sri Lanka)"
      ),

    // Number of children 
    numberOfChildren: z.coerce
      .number()
      .min(0, "Number of children is required")
      .int("Must be a whole number"),

    // Children ages 
    childrenAges: z.string().optional(),

    // Optional occupation
    occupation: z.string().optional(),

    // Monthly income 
    monthlyIncome: z.coerce
      .number()
      .min(1, "Monthly income is required")
      .int("Must be a valid number"),
  })

  // Custom rule for validating children's ages
  .refine(
    (data) => {
      const numChildren = data.numberOfChildren;
      if (numChildren > 0) {
        if (!data.childrenAges?.trim()) return false; 
        const ages = data.childrenAges.split(",").map((a) => a.trim());
        if (ages.length !== numChildren) return false; 
        if (!ages.every((a) => /^\d+$/.test(a))) return false; 
      }
      return true;
    },
    {
      message:
        "Enter the exact number of children's ages separated by commas (e.g., 5, 8, 12)",
      path: ["childrenAges"],
    }
  );

export default function Form1Page() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      dateOfBirth: null,
      spouseName: "",
      phoneNumber: "",
      address: "",
      numberOfChildren: "",
      childrenAges: "",
      occupation: "",
      monthlyIncome: "",
    },
  });

  const numChildren = watch("numberOfChildren");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* LEFT SIDE */}
            <div className="flex flex-col space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  placeholder="Ex: Sunil Nishantha Karunarathna"
                  className={`border ${
                    errors.fullName
                      ? "border-[var(--error-400)]"
                      : "border-[#8EABD2]"
                  } rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none`}
                />
                {errors.fullName && (
                  <p className="text-xs mt-1 text-[var(--error-400)]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

                {/* Date of Birth */}
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-1">
                    Date of Birth
                  </label>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <div className="relative">
                        <input
                          readOnly
                          value={field.value ? format(field.value, "dd/MM/yyyy") : ""}
                          placeholder="DD/MM/YYYY"
                          className={`border ${
                            errors.dateOfBirth
                              ? "border-[var(--error-400)]"
                              : "border-[#8EABD2]"
                          } rounded-full px-3 py-2 pr-10 bg-[#DCE7F2] w-full focus:outline-none cursor-pointer`}
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
                              selected={field.value}
                              onSelect={(d) => {
                                field.onChange(d);
                                setOpen(false);
                              }}
                              fromYear={1950}
                              toYear={2025}
                              captionLayout="dropdown"
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        {mounted && isMobile && open && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                              className="absolute inset-0 bg-black/40"
                              onClick={() => setOpen(false)}
                            />
                            <div className="relative z-50 bg-white rounded-2xl p-3 shadow-lg border border-gray-200">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(d) => {
                                  field.onChange(d);
                                  setOpen(false);
                                }}
                                fromYear={1950}
                                toYear={2025}
                                captionLayout="dropdown"
                                initialFocus
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  />

                  {errors.dateOfBirth && (
                    <p className="text-xs mt-1 text-[var(--error-400)]">
                      {errors.dateOfBirth.message}
                    </p>
                  )}

                  {(() => {
                    const dob = watch("dateOfBirth");
                    if (dob) {
                      const today = new Date();
                      let age = today.getFullYear() - dob.getFullYear();
                      const m = today.getMonth() - dob.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                        age--;
                      }
                      console.log("Calculated Age:", age); 
                    }
                  })()}
                </div>

              {/* Spouse Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Spouse’s Name
                </label>
                <input
                  {...register("spouseName")}
                  placeholder="Ex: Samanthi Ishara Karunarathna"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none"
                />
              </div>

              {/* Children’s Ages */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Children’s Ages
                </label>
                <input
                  {...register("childrenAges")}
                  placeholder="Ex: 5, 8, 12"
                  className={`border ${
                    errors.childrenAges ? "border-[var(--error-400)]" : "border-[#8EABD2]"
                  } rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none`}
                />
                {errors.childrenAges && (
                  <p className="text-xs mt-1 text-[var(--error-400)]">
                    {errors.childrenAges.message}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col space-y-3">
              {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  {...register("address")}
                  placeholder="Your Address"
                  className={`border ${
                    errors.address ? "border-[var(--error-400)]" : "border-[#8EABD2]"
                  } rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none`}
                />
                {errors.address && (
                  <p className="text-xs mt-1 text-[var(--error-400)]">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber")}
                  placeholder="Ex: +94771234567"
                  className={`border ${
                    errors.phoneNumber ? "border-[var(--error-400)]" : "border-[#8EABD2]"
                  } rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none`}
                />
                {errors.phoneNumber && (
                  <p className="text-xs mt-1 text-[var(--error-400)]">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Number of Children */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Number of Children
                </label>
                <input
                  {...register("numberOfChildren")}
                  placeholder="Ex: 3"
                  className={`border ${
                    errors.numberOfChildren ? "border-[var(--error-400)]" : "border-[#8EABD2]"
                  } rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none`}
                />
                {errors.numberOfChildren && (
                  <p className="text-xs mt-1 text-[var(--error-400)]">
                    {errors.numberOfChildren.message}
                  </p>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Occupation / Business (Optional)
                </label>
                <input
                  {...register("occupation")}
                  placeholder="Your Job/Business"
                  className="border border-[#8EABD2] rounded-full px-3 py-2 bg-[#DCE7F2] w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Monthly Income */}
            <div
              className={`${
                isMobile ? "md:col-span-2" : "md:col-span-2 flex flex-col items-center mt-1"
              }`}
            >
              <label className="block text-gray-700 font-medium mb-1">
                Monthly Income (LKR)
              </label>
              <input
                {...register("monthlyIncome")}
                placeholder="Ex: 70000"
                className={`border ${
                  errors.monthlyIncome ? "border-[var(--error-400)]" : "border-[#8EABD2]"
                } rounded-full px-3 py-2 bg-[#DCE7F2] w-full max-w-md focus:outline-none`}
              />
              {errors.monthlyIncome && (
                <p className="text-xs mt-1 text-[var(--error-400)]">
                  {errors.monthlyIncome.message}
                </p>
              )}
            </div>
          </form>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <FormNavButton label="Back" type="prev" variant="gradient" disabled />
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
