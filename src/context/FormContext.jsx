"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Create the Form Context
const FormContext = createContext(undefined);

// Local storage key
const STORAGE_KEY = "needalyze-form-data";

// Initial state structure for all form steps
const initialFormState = {
  step1: {
    fullName: "",
    dateOfBirth: null,
    spouseName: "",
    address: "",
    phoneNumber: "",
    numberOfChildren: "",
    childrenAges: "",
    occupation: "",
    age: "",
    monthlyIncome: "",
  },
  step2: {
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
  step3: {
    fixedMonthlyExpenses: "",
    bankInterestRate: "",
    unsecuredBankLoan: "",
    cashInHandInsurance: "",
    hlvalue: 0,
    actualHLValue: 0,
  },
  step4: {
    completed: false,
    completedAt: null,
  },
};

// Convert a `need_analysis_form` database row into the shape the form steps
// expect. Note: the database only ever persists `human_life_value` for
// step3 (see api/form/[linkId]/route.js) and has no completion-timestamp
// column, so those fields can't be restored here.
function convertDbDataToFormState(dbData) {
  return {
    step1: {
      fullName: dbData.full_name || "",
      dateOfBirth: dbData.date_of_birth
        ? new Date(dbData.date_of_birth)
        : null,
      spouseName: dbData.spouse_name || "",
      address: dbData.address || "",
      phoneNumber: dbData.phone_number || "",
      numberOfChildren: dbData.number_of_children || "",
      childrenAges: dbData.children_ages || "",
      occupation: dbData.occupation || "",
      age: dbData.age || "",
      monthlyIncome: dbData.monthly_income || "",
    },
    step2: {
      insuranceNeeds: {
        dependentCostOfLiving:
          dbData.insurance_needs?.includes("dependentCostOfLiving") || false,
        higherEducationChildren:
          dbData.insurance_needs?.includes("higherEducationChildren") ||
          false,
        longTermSavings:
          dbData.insurance_needs?.includes("longTermSavings") || false,
        shortTermSavings:
          dbData.insurance_needs?.includes("shortTermSavings") || false,
        pensionFund:
          dbData.insurance_needs?.includes("pensionFund") || false,
      },
      healthCovers: {
        dailyHospitalizationExpenses:
          dbData.health_covers?.includes("dailyHospitalizationExpenses") ||
          false,
        surgeryCover:
          dbData.health_covers?.includes("surgeryCover") || false,
        hospitalBillCover:
          dbData.health_covers?.includes("hospitalBillCover") || false,
        criticalIllness:
          dbData.health_covers?.includes("criticalIllness") || false,
      },
    },
    step3: {
      fixedMonthlyExpenses: "",
      bankInterestRate: "",
      unsecuredBankLoan: "",
      cashInHandInsurance: "",
      hlvalue: dbData.human_life_value || 0,
      actualHLValue: 0,
    },
    step4: {
      completed: dbData.status === "completed",
      // No real completion timestamp is stored in the database — leave it
      // null rather than fabricating "now" as if it were accurate.
      completedAt: null,
    },
  };
}

// Form Provider Component
export function FormProvider({ children }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [linkId, setLinkId] = useState(null);
  const [advisorUserId, setAdvisorUserId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const params = useParams();

  // Initialize form data from database or localStorage
  useEffect(() => {
    const initializeFormData = async () => {
      if (params?.linkId) {
        setLinkId(params?.linkId);

        try {
          // Try to get data from database first
          const response = await fetch(`/api/form/${params.linkId}`);
          const result = await response.json();
          setApiError(
            result.success
              ? null
              : {
                  status: response.status,
                  message: result?.error || "Failed to load data",
                }
          );

          if (result.success && result.formData) {
            // Convert database data to form format
            const convertedData = convertDbDataToFormState(result.formData);

            setFormData(convertedData);
            setAdvisorUserId(result.linkData.user_id);

            // Update localStorage with database data
            const dataToSave = { ...convertedData };
            if (dataToSave.step1?.dateOfBirth instanceof Date) {
              dataToSave.step1.dateOfBirth =
                dataToSave.step1.dateOfBirth.toISOString();
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
          }
        } catch (error) {
          console.error("Error loading form data:", error);
          setApiError({
            status: 500,
            message: error.message || "Unknown error",
          });
          // Fallback to localStorage
          const savedData = localStorage.getItem(STORAGE_KEY);
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.step1?.dateOfBirth) {
              parsedData.step1.dateOfBirth = new Date(
                parsedData.step1.dateOfBirth
              );
            }
            setFormData(parsedData);
          }
        }
      }

      setIsLoaded(true);
    };

    initializeFormData();
  }, [params?.linkId]);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        const dataToSave = { ...formData };
        if (dataToSave.step1?.dateOfBirth instanceof Date) {
          dataToSave.step1.dateOfBirth =
            dataToSave.step1.dateOfBirth.toISOString();
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [formData, isLoaded]);

  // Save step data to database
  const saveStepToDatabase = async (step, data) => {
    if (!linkId) throw new Error("No link ID available");

    try {
      const response = await fetch(`/api/form/${linkId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step,
          data,
          user_id: advisorUserId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("Error saving to database:", error);
      throw error;
    }
  };

  // Update step data (both localStorage and database)
  const updateStepData = async (step, data, saveToDb = false) => {
    // Update local state and localStorage
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data,
      },
    }));

    // Save to database if requested
    if (saveToDb && linkId) {
      try {
        await saveStepToDatabase(step, data);
        return { success: true };
      } catch (error) {
        console.error("Failed to save to database:", error);
        return { success: false, error: error.message || "Failed to save data" };
      }
    }

    return { success: true };
  };

  // Get data for a specific step
  const getStepData = (step) => {
    return formData[step];
  };

  // Reset all form data
  const resetForm = () => {
    setFormData(initialFormState);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  };

  // Get all form data
  const getAllData = () => {
    return formData;
  };

  const value = {
    formData,
    updateStepData,
    getStepData,
    resetForm,
    getAllData,
    isLoaded,
    linkId,
    saveStepToDatabase,
    apiError,
    clearApiError: () => setApiError(null),
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// Custom hook to use the Form Context
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
