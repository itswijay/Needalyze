"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NeedAnalysisFormHeader from '@/components/NeedAnalysisFormHeader';
import ProgressBar from '@/components/ProgressBar';
import FormContainer from '@/components/FormContainer';
import FormNavButton from '@/components/FormNavButton';


export default function NeedAnalysisFormPage2() {
  const router = useRouter();
  
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
    router.push('/form/step1');
  };

  const handleNext = () => {
    router.push('/form/step3');
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NeedAnalysisFormHeader />
      <ProgressBar currentStep={2} totalSteps={4} />

      <section className="flex-grow flex justify-center pb-10 px-4 sm:px-6 lg:px-8">
        <FormContainer>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            
            {/* Insurance Need Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 relative shadow-lg sm:shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-gray-700 font-medium">Insurance Need</h2>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#89acd0'}}>
                  <span className="text-white text-sm font-bold">i</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
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
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 relative shadow-lg sm:shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-gray-700 font-medium">Health Covers</h2>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#89acd0'}}>
                  <span className="text-white text-sm font-bold">i</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
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

          <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 mt-10">
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
              onClick={handleNext}
            />
          </div>
        </FormContainer>
      </section>
    </main>
  );
}

// Checkbox Card Component with enhanced shadows and mobile optimization
function CheckboxCard({ label, checked, onChange }) {
  return (
    <div 
      className="flex items-center px-4 py-3 bg-white rounded-full shadow-xl border border-gray-200 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
      onClick={onChange}
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors flex-shrink-0 ${
        checked 
          ? 'border-2' 
          : 'border-2'
      }`}
      style={{
        backgroundColor: checked ? '#1b477f' : '#89acd0',
        borderColor: checked ? '#1b477f' : '#89acd0'
      }}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );
}