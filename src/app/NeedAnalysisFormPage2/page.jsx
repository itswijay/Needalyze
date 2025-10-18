"use client";

import { useState } from 'react';
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader';
import ProgressBar from '@/components/ProgressBar';
import FormContainer from '@/components/FormContainer';


export default function NeedAnalysisFormPage2() {
  const [insuranceNeeds, setInsuranceNeeds] = useState({
    dependentCostOfLiving: false,
    higherEducationChildren: false,
    longTermSavings: false,
    shortTermSavings: false,
    pensionFund: false,
  });

  const [healthCovers, setHealthCovers] = useState({
    dailyHospitalizationExpenses: false,
    surgeryCover: false,
    hospitalBillCover: false,
    criticalIllness: false,
  });

  const handleInsuranceNeedChange = (field) => {
    setInsuranceNeeds(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleHealthCoverChange = (field) => {
    setHealthCovers(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleBack = () => {
    console.log('Navigate back');
  };

  const handleNext = () => {
    console.log('Navigate next', { insuranceNeeds, healthCovers });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={2} />
      
      <div className="flex justify-center pt-6 pb-10 px-4 sm:px-6 lg:px-8">
        <FormContainer className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            
            {/* Insurance Need Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-sans">Insurance Need</h2>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#89acd0'}}>
                  <span className="text-white text-xs sm:text-sm font-bold font-sans">i</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <CheckboxCard
                  label="Dependent Cost of Living"
                  checked={insuranceNeeds.dependentCostOfLiving}
                  onChange={() => handleInsuranceNeedChange('dependentCostOfLiving')}
                />
                <CheckboxCard
                  label="Higher Education of Children"
                  checked={insuranceNeeds.higherEducationChildren}
                  onChange={() => handleInsuranceNeedChange('higherEducationChildren')}
                />
                <CheckboxCard
                  label="Long Term Savings"
                  checked={insuranceNeeds.longTermSavings}
                  onChange={() => handleInsuranceNeedChange('longTermSavings')}
                />
                <CheckboxCard
                  label="Short Term Savings"
                  checked={insuranceNeeds.shortTermSavings}
                  onChange={() => handleInsuranceNeedChange('shortTermSavings')}
                />
                <CheckboxCard
                  label="Pension Fund"
                  checked={insuranceNeeds.pensionFund}
                  onChange={() => handleInsuranceNeedChange('pensionFund')}
                />
              </div>
            </div>

            {/* Health Covers Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-sans">Health Covers</h2>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#89acd0'}}>
                  <span className="text-white text-xs sm:text-sm font-bold font-sans">i</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <CheckboxCard
                  label="Daily Hospitalization Expenses"
                  checked={healthCovers.dailyHospitalizationExpenses}
                  onChange={() => handleHealthCoverChange('dailyHospitalizationExpenses')}
                />
                <CheckboxCard
                  label="Surgery Cover"
                  checked={healthCovers.surgeryCover}
                  onChange={() => handleHealthCoverChange('surgeryCover')}
                />
                <CheckboxCard
                  label="Hospital Bill Cover"
                  checked={healthCovers.hospitalBillCover}
                  onChange={() => handleHealthCoverChange('hospitalBillCover')}
                />
                <CheckboxCard
                  label="Critical Illness"
                  checked={healthCovers.criticalIllness}
                  onChange={() => handleHealthCoverChange('criticalIllness')}
                />
              </div>
            </div>
          </div>

          {/* Navigation buttons with original colors */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 sm:mt-12">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-white font-medium font-sans shadow-md hover:shadow-lg transition 
                         bg-gradient-to-r from-[#89ACD0] to-[#2662B0] order-2 sm:order-1"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-white font-medium font-sans shadow-md hover:shadow-lg transition 
                         bg-gradient-to-r from-[#89ACD0] to-[#2662B0] order-1 sm:order-2"
            >
              Next →
            </button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
}

// Checkbox Card Component with enhanced shadows
function CheckboxCard({ label, checked, onChange }) {
  return (
    <div 
      className="flex items-center p-3 sm:p-4 bg-white rounded-2xl sm:rounded-full shadow-2xl border border-gray-200 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
      onClick={onChange}
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md border-2 mr-3 sm:mr-4 flex items-center justify-center transition-colors flex-shrink-0 ${
        checked 
          ? 'border-2' 
          : 'border-2'
      }`}
      style={{
        backgroundColor: checked ? '#1b477f' : '#89acd0',
        borderColor: checked ? '#1b477f' : '#89acd0'
      }}>
        {checked && (
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg font-sans">{label}</span>
    </div>
  );
}