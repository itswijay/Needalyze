"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NeedAnalysisFormHeader from "@/components/NeedAnalysisFormHeader";
import ProgressBar from "@/components/ProgressBar";
import FormContainer from "@/components/FormContainer";
import FormNavButton from "@/components/FormNavButton";

// Zod validation schema
const step2Schema = z.object({
  insuranceNeeds: z.object({
    dependentCostOfLiving: z.boolean(),
    higherEducationChildren: z.boolean(),
    longTermSavings: z.boolean(),
    shortTermSavings: z.boolean(),
    pensionFund: z.boolean(),
  }).refine((data) => {
    const selectedCount = Object.values(data).filter(Boolean).length;
    return selectedCount >= 1 && selectedCount <= 5;
  }, {
    message: "Please select between 1 and 5 insurance need options",
    path: ["root"]
  }),
  
  healthCovers: z.object({
    dailyHospitalizationExpenses: z.boolean(),
    surgeryCover: z.boolean(),
    hospitalBillCover: z.boolean(),
    criticalIllness: z.boolean(),
  }).refine((data) => {
    const selectedCount = Object.values(data).filter(Boolean).length;
    return selectedCount <= 3;
  }, {
    message: "You can select maximum 3 health cover options",
    path: ["maxSelection"]
  }).refine((data) => {
    // Cannot select both hospital bill cover and surgery cover
    return !(data.hospitalBillCover && data.surgeryCover);
  }, {
    message: "You cannot select both Hospital Bill Cover and Surgery Cover at the same time",
    path: ["mutualExclusion"]
  })
});

export default function NeedAnalysisFormPage2() {
  const router = useRouter();
  const [showConflictMessage, setShowConflictMessage] = useState(false);

  const { 
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      insuranceNeeds: {
        dependentCostOfLiving: false,
        higherEducationChildren: false,
        longTermSavings: false,
        shortTermSavings: false,
        pensionFund: false,
      },
      healthCovers: {
        dailyHospitalizationExpenses: false,
        surgeryCover: false,
        hospitalBillCover: false,
        criticalIllness: false,
      },
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  const handleInsuranceNeedChange = (field, currentValue) => {
    const newValue = !currentValue;
    setValue(`insuranceNeeds.${field}`, newValue, { shouldValidate: true });
  };

  const handleHealthCoverChange = (field, currentValue) => {
    const newValue = !currentValue;
    
    // Show message when trying to select Surgery Cover while Hospital Bill Cover is selected
    if (field === 'surgeryCover' && newValue && watchedValues.healthCovers?.hospitalBillCover) {
      setShowConflictMessage(true);
      return;
    }
    
    // Show message when trying to select Hospital Bill Cover while Surgery Cover is selected
    if (field === 'hospitalBillCover' && newValue && watchedValues.healthCovers?.surgeryCover) {
      setShowConflictMessage(true);
      return;
    }
    
    // Hide message when deselecting conflicting options
    if (!newValue && (field === 'surgeryCover' || field === 'hospitalBillCover')) {
      setShowConflictMessage(false);
    }
    
    // Check validation for max selections
    const currentHealthCovers = { ...watchedValues.healthCovers, [field]: newValue };
    const selectedCount = Object.values(currentHealthCovers).filter(Boolean).length;
    
    // Prevent selection if more than 3 options
    if (newValue && selectedCount > 3) {
      return;
    }
    
    setValue(`healthCovers.${field}`, newValue, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    // Store form data in localStorage or context for later use
    localStorage.setItem('step2Data', JSON.stringify(data));
    router.push("/form/step3");
  };

  const handleBack = () => router.push("/form/step1");

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={2} totalSteps={4} />

      <section className="flex-grow flex justify-center items-start py-8 px-4">
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-sm -mt-4">
              {/* Insurance Need Section */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-gray-700 font-medium text-base">
                    Insurance Need
                  </h2>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#89acd0" }}
                  >
                    <span className="text-white text-sm font-bold">i</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Controller
                    name="insuranceNeeds.dependentCostOfLiving"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Dependent Cost of Living"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange("dependentCostOfLiving", field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.higherEducationChildren"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Higher Education of Children"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange("higherEducationChildren", field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.longTermSavings"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Long Term Savings"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange("longTermSavings", field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.shortTermSavings"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Short Term Savings"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange("shortTermSavings", field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="insuranceNeeds.pensionFund"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Pension Fund"
                        checked={field.value}
                        onChange={() =>
                          handleInsuranceNeedChange("pensionFund", field.value)
                        }
                      />
                    )}
                  />
                </div>
                {errors.insuranceNeeds?.root && (
                  <p className="text-red-500 text-xs mt-2">{errors.insuranceNeeds.root.message}</p>
                )}
              </div>

              {/* Health Covers Section */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <h2 className="text-gray-700 font-medium text-base">
                    Health Covers
                  </h2>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#89acd0" }}
                  >
                    <span className="text-white text-sm font-bold">i</span>
                  </div>
                </div>

                {/* Conflict Warning Message */}
                {showConflictMessage && (
                  <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-lg shadow-lg">
                    <p className="text-red-700 text-sm font-bold">
                      ⚠️ You cannot select both Hospital Bill Cover and Surgery Cover at the same time
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Controller
                    name="healthCovers.dailyHospitalizationExpenses"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Daily Hospitalization Expenses"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange("dailyHospitalizationExpenses", field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="healthCovers.surgeryCover"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Surgery Cover"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange("surgeryCover", field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="healthCovers.hospitalBillCover"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Hospital Bill Cover"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange("hospitalBillCover", field.value)
                        }
                      />
                    )}
                  />
                  <Controller
                    name="healthCovers.criticalIllness"
                    control={control}
                    render={({ field }) => (
                      <CheckboxCard
                        label="Critical Illness"
                        checked={field.value}
                        onChange={() =>
                          handleHealthCoverChange("criticalIllness", field.value)
                        }
                      />
                    )}
                  />
                </div>
                {(errors.healthCovers?.maxSelection || errors.healthCovers?.mutualExclusion) && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.healthCovers.maxSelection?.message || errors.healthCovers.mutualExclusion?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-row justify-between items-center mt-8 w-full">
              <FormNavButton
                label="Back"
                type="prev"
                variant="gradient"
                onClick={handleBack}
              />
              <FormNavButton
                label="Next"
                type="next"
                variant="gradient"
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </form>
        </FormContainer>
      </section>
    </main>
  );
}

// Checkbox Card Component
function CheckboxCard({ label, checked, onChange, disabled = false }) {
  return (
    <div
      className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 bg-white rounded-full shadow-xl border border-gray-200 
                 transition-all duration-300 ${
                   disabled 
                     ? 'cursor-not-allowed opacity-50' 
                     : 'cursor-pointer hover:shadow-2xl hover:scale-105'
                 }`}
      onClick={disabled ? undefined : onChange}
      style={{
        boxShadow:
          "0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 mr-2 sm:mr-3 flex items-center justify-center transition-colors flex-shrink-0`}
        style={{
          backgroundColor: checked ? "#1b477f" : disabled ? "#d1d5db" : "#89acd0",
          borderColor: checked ? "#1b477f" : disabled ? "#d1d5db" : "#89acd0",
        }}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 
              01-1.414 0l-4-4a1 1 0 
              011.414-1.414L8 12.586l7.293-7.293a1 1 
              0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span className={`font-medium text-sm sm:text-base ${
        disabled ? 'text-gray-400' : 'text-gray-700'
      }`}>
        {label}
      </span>
    </div>
  );
}
