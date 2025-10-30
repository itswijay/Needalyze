'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Create the Form Context
const FormContext = createContext(undefined)

// Local storage key
const STORAGE_KEY = 'needalyze-form-data'

// Initial state structure for all form steps
const initialFormState = {
  step1: {
    fullName: '',
    dateOfBirth: null,
    spouseName: '',
    address: '',
    phoneNumber: '',
    numberOfChildren: '',
    childrenAges: '',
    occupation: '',
    age: '',
    monthlyIncome: '',
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
    fixedMonthlyExpenses: '',
    bankInterestRate: '',
    unsecuredBankLoan: '',
    cashInHandInsurance: '',
    hlvalue: 0,
    actualHLValue: 0,
  },
  step4: {
    completed: false,
    completedAt: null,
  },
}

// Form Provider Component
export function FormProvider({ children }) {
  const [formData, setFormData] = useState(initialFormState)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          // Convert dateOfBirth string back to Date object if exists
          if (parsedData.step1?.dateOfBirth) {
            parsedData.step1.dateOfBirth = new Date(
              parsedData.step1.dateOfBirth
            )
          }
          setFormData(parsedData)
        }
      } catch (error) {
        console.error('Error loading form data from localStorage:', error)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        // Create a copy for storage, converting Date to string
        const dataToSave = { ...formData }
        if (dataToSave.step1?.dateOfBirth instanceof Date) {
          dataToSave.step1.dateOfBirth =
            dataToSave.step1.dateOfBirth.toISOString()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving form data to localStorage:', error)
      }
    }
  }, [formData, isLoaded])

  // Update data for a specific step
  const updateStepData = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data,
      },
    }))
  }

  // Get data for a specific step
  const getStepData = (step) => {
    return formData[step]
  }

  // Reset all form data
  const resetForm = () => {
    setFormData(initialFormState)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Error clearing localStorage:', error)
      }
    }
  }

  // Get all form data
  const getAllData = () => {
    return formData
  }

  const value = {
    formData,
    updateStepData,
    getStepData,
    resetForm,
    getAllData,
    isLoaded,
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

// Custom hook to use the Form Context
export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}