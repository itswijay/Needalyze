'use client'
import React from 'react'

const PDFTemplate = ({ formData }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return ''
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div
      id="pdf-content"
      className="bg-white p-8 font-sans max-w-4xl mx-auto"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#000'
      }}
    >
      {/* Header */}
      <div className="border-4 border-red-600 p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Need Analysis Form</h1>
          <div className="text-right">
            <div className="bg-black text-white px-3 py-1 text-sm font-bold">
              SLIC
            </div>
            <div className="bg-black text-white px-3 py-1 text-sm font-bold mt-1">
              LIFE
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="mb-2">
              <span className="font-bold">Name:</span> 
              <span className="ml-2 border-b border-black inline-block min-w-[200px] pb-1">
                {formData.step1?.fullName || ''}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Date of Birth:</span>
              <span className="ml-2 border-b border-black inline-block min-w-[150px] pb-1">
                {formatDate(formData.step1?.dateOfBirth) || ''}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Address:</span>
              <span className="ml-2 border-b border-black inline-block min-w-[200px] pb-1">
                {formData.step1?.address || ''}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Contact Number:</span>
              <span className="ml-2 border-b border-black inline-block min-w-[150px] pb-1">
                {formData.step1?.phoneNumber || ''}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-bold">Name of Spouse:</span>
              <span className="ml-2 border-b border-black inline-block min-w-[150px] pb-1">
                {formData.step1?.spouseName || ''}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Age of Spouse:</span>
              <span className="ml-2 border-b border-black inline-block min-w-[100px] pb-1">
                {formData.step1?.age || ''}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">No of Children:</span>
              <span className="ml-2 border-b border-black inline-block min-w-[100px] pb-1">
                {formData.step1?.numberOfChildren || ''}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Ages of Children:</span>
              <span className="ml-2 border-b border-black inline-block min-w-[150px] pb-1">
                {formData.step1?.childrenAges || ''}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="mb-2">
            <span className="font-bold">Job/Business:</span>
            <span className="ml-2 border-b border-black inline-block min-w-[200px] pb-1">
              {formData.step1?.occupation || ''}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-bold">Average Monthly Income:</span>
            <span className="ml-2 border-b border-black inline-block min-w-[150px] pb-1">
              {formatCurrency(formData.step1?.monthlyIncome) || ''}
            </span>
          </div>
        </div>

        {/* Insurance Need Section */}
        <div className="border-2 border-green-500 p-4 mb-6">
          <h3 className="font-bold mb-3">Insurance Need</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="mb-2">
                <span>1. Dependents Cost of Living</span>
                <span className="ml-4 border border-black w-4 h-4 inline-block text-center">
                  {formData.step2?.insuranceNeeds?.dependentCostOfLiving ? '✓' : ''}
                </span>
              </div>
              <div className="mb-2">
                <span>3. Long Term Savings</span>
                <span className="ml-4 border border-black w-4 h-4 inline-block text-center">
                  {formData.step2?.insuranceNeeds?.longTermSavings ? '✓' : ''}
                </span>
              </div>
              <div className="mb-2">
                <span>5. Pension Fund</span>
                <span className="ml-4 border border-black w-4 h-4 inline-block text-center">
                  {formData.step2?.insuranceNeeds?.pensionFund ? '✓' : ''}
                </span>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span>2. Higher Education of Children</span>
                <span className="ml-4 border border-black w-4 h-4 inline-block text-center">
                  {formData.step2?.insuranceNeeds?.higherEducationChildren ? '✓' : ''}
                </span>
              </div>
              <div className="mb-2">
                <span>4. Short Term Savings</span>
                <span className="ml-4 border border-black w-4 h-4 inline-block text-center">
                  {formData.step2?.insuranceNeeds?.shortTermSavings ? '✓' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right mb-4">
            <span className="text-blue-600 font-bold">+2 Buttons for calculations</span>
          </div>

          {/* Health Covers */}
          <div className="mb-4">
            <span className="font-bold">6. Health Covers</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div>1. Daily Hospitalization Expenses</div>
              <div className="border border-black w-full h-8 mt-2 flex items-center justify-center">
                {formData.step2?.healthCovers?.dailyHospitalizationExpenses ? '✓' : ''}
              </div>
            </div>
            <div className="text-center">
              <div>2. Surgery Cover</div>
              <div className="border border-black w-full h-8 mt-2 flex items-center justify-center">
                {formData.step2?.healthCovers?.surgeryCover ? '✓' : ''}
              </div>
            </div>
            <div className="text-center">
              <div>3. Hospital Bill Cover</div>
              <div className="border border-black w-full h-8 mt-2 flex items-center justify-center">
                {formData.step2?.healthCovers?.hospitalBillCover ? '✓' : ''}
              </div>
            </div>
            <div className="text-center">
              <div>4. Critical Illnesses</div>
              <div className="border border-black w-full h-8 mt-2 flex items-center justify-center">
                {formData.step2?.healthCovers?.criticalIllness ? '✓' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Sections */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Life Cover Calculation */}
          <div className="border-2 border-gray-400 p-4 bg-gray-100">
            <h4 className="font-bold mb-3 text-center">Calculation of Life Cover</h4>
            
            <div className="mb-3">
              <span>Fixed Monthly Expenses</span>
              <div className="border border-black w-full h-8 mt-1 flex items-center px-2">
                {formatCurrency(formData.step3?.fixedMonthlyExpenses) || ''}
              </div>
              <div className="text-right mt-1">x12x100 = Human Life Value</div>
            </div>

            <div className="mb-3">
              <span>(Bank Interest Rate)</span>
              <div className="border border-black w-full h-8 mt-1 flex items-center px-2">
                {formData.step3?.bankInterestRate ? `${formData.step3.bankInterestRate}%` : ''}
              </div>
            </div>

            <div className="mb-3">
              <span>(Add) Unsecured Bank Loans</span>
              <div className="border border-black w-full h-8 mt-1 flex items-center px-2">
                {formatCurrency(formData.step3?.unsecuredBankLoan) || ''}
              </div>
            </div>

            <div className="mb-3">
              <span>(Deduct) Cash in Hand + Insurance =</span>
              <div className="border border-black w-full h-8 mt-1 flex items-center px-2">
                {formatCurrency(formData.step3?.cashInHandInsurance) || ''}
              </div>
            </div>

            <div className="border-t-2 border-black pt-2">
              <div className="text-center font-bold">
                (Actual Human Life Value)
              </div>
              <div className="text-center text-lg font-bold">
                {formatCurrency(formData.step3?.actualHLValue) || '0'}
              </div>
            </div>
          </div>

          {/* Permanent Disability Cover Calculation */}
          <div className="border-2 border-orange-400 p-4 bg-orange-50">
            <h4 className="font-bold mb-3 text-center">Calculation of Permanent Disability Cover</h4>
            
            <div className="mb-3">
              <span>Permanent Disability</span>
              <span className="ml-2">Cover = 120 Months</span>
              <div className="text-right text-sm italic mt-1">
                (It cannot be equal to basic monthly expenses)
              </div>
            </div>

            <div className="mb-3">
              <span>Hospitalization</span>
            </div>

            <div className="mb-2">
              <span>For Daily Hospitalization Expenses Rs:</span>
              <span className="border-b border-black inline-block w-24 ml-2">
                {formatCurrency(formData.step2?.healthCovers?.dailyHospitalizationExpenses ? 5000 : 0)}
              </span>
            </div>

            <div className="mb-2">
              <span>For Surgery (Maximum) Rs:</span>
              <span className="border-b border-black inline-block w-24 ml-2">
                {formatCurrency(formData.step2?.healthCovers?.surgeryCover ? 100000 : 0)}
              </span>
            </div>

            <div className="mb-2">
              <span>Hospital Bill Claim (Per Annum) Rs:</span>
              <span className="border-b border-black inline-block w-24 ml-2">
                {formatCurrency(formData.step2?.healthCovers?.hospitalBillCover ? 200000 : 0)}
              </span>
            </div>

            <div className="mb-3">
              <span>Critical Illness Cover =</span>
              <span className="border-b border-black inline-block w-24 ml-2">
                {formatCurrency(formData.step2?.healthCovers?.criticalIllness ? 500000 : 0)}
              </span>
              <div className="text-right text-sm">(For 25 Diseases)</div>
            </div>

            <div className="mb-3">
              <span>Pension Fund</span>
              <div className="mt-1">
                <span>From Age ... Rs................ Per Monthly For..... Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="text-center">
            <div className="border-t-2 border-black pt-2">
              <span className="font-bold">Signature of Customer</span>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-black pt-2">
              <span className="font-bold">Signature of Insurance Advisor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFTemplate