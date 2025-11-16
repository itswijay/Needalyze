import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const generatePDF = async (formData) => {
  try {
    // Create a temporary container for the PDF content
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '794px' // A4 width in pixels at 96 DPI
    tempContainer.style.background = 'white'
    tempContainer.style.zIndex = '-1000'
    tempContainer.style.padding = '0'
    tempContainer.style.margin = '0'
    
    // Create the HTML content directly instead of using React rendering
    tempContainer.innerHTML = createPDFHTML(formData)
    
    document.body.appendChild(tempContainer)

    // Wait a moment for rendering
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get the rendered element
    const element = tempContainer.firstElementChild

    if (!element) {
      throw new Error('PDF content not rendered properly')
    }

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    })

    // Create PDF
    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Calculate dimensions to fit A4
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate the image dimensions to fit the page
    const imgWidth = pageWidth - 20 // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // If the image is taller than the page, we might need to scale it down
    const finalWidth = imgHeight > pageHeight - 20 ? (pageWidth - 20) * (pageHeight - 20) / imgHeight : imgWidth
    const finalHeight = imgHeight > pageHeight - 20 ? pageHeight - 20 : imgHeight
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 10, 10, finalWidth, finalHeight)
    
    // Generate filename with current date
    const currentDate = new Date().toLocaleDateString('en-IN').replace(/\//g, '-')
    const customerName = formData.step1?.fullName || 'Customer'
    const filename = `Need_Analysis_${customerName.replace(/\s+/g, '_')}_${currentDate}.pdf`
    
    // Download the PDF
    pdf.save(filename)
    
    // Cleanup
    document.body.removeChild(tempContainer)
    
    return { success: true, filename }
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }
}

const createPDFHTML = (formData) => {
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

  return `
    <div style="
      background: white; 
      padding: 20px; 
      font-family: Arial, sans-serif; 
      font-size: 12px; 
      line-height: 1.3; 
      color: #000; 
      max-width: 800px; 
      margin: 0 auto;
      border: 2px solid #000;
    ">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Need Analysis Form</h1>
        <div style="text-align: center;">
          <div style="background: #666; color: white; padding: 2px 8px; font-size: 10px; font-weight: bold; border-radius: 2px;">
            SLIC
          </div>
          <div style="background: #000; color: white; padding: 2px 8px; font-size: 10px; font-weight: bold; margin-top: 2px;">
            LIFE
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div style="margin-bottom: 20px;">
        <!-- Row 1 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 80px; font-weight: normal;">Name</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 40px; padding-bottom: 2px;">
            ${formData.step1?.fullName || ''}
          </span>
        </div>
        
        <!-- Row 2 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 100px; font-weight: normal;">Date of Birth</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 20px; padding-bottom: 2px;">
            ${formatDate(formData.step1?.dateOfBirth) || ''}
          </span>
        </div>
        
        <!-- Row 3 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 80px; font-weight: normal;">Address</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 40px; padding-bottom: 2px;">
            ${formData.step1?.address || ''}
          </span>
        </div>
        
        <!-- Row 4 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 120px; font-weight: normal;">Contact Number</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 0px; padding-bottom: 2px;">
            ${formData.step1?.phoneNumber || ''}
          </span>
        </div>
        
        <!-- Row 5 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 120px; font-weight: normal;">Name of Spouse</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 0px; padding-bottom: 2px;">
            ${formData.step1?.spouseName || ''}
          </span>
        </div>
        
        <!-- Row 6 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 100px; font-weight: normal;">Age of Spouse</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 20px; padding-bottom: 2px;">
            ${formData.step1?.age || ''}
          </span>
        </div>
        
        <!-- Row 7 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 100px; font-weight: normal;">No of Children</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 20px; padding-bottom: 2px;">
            ${formData.step1?.numberOfChildren || ''}
          </span>
        </div>
        
        <!-- Row 8 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 120px; font-weight: normal;">Ages of Children</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 0px; padding-bottom: 2px;">
            ${formData.step1?.childrenAges || ''}
          </span>
        </div>
        
        <!-- Row 9 -->
        <div style="display: flex; margin-bottom: 10px;">
          <span style="width: 100px; font-weight: normal;">Job/Business</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 20px; padding-bottom: 2px;">
            ${formData.step1?.occupation || ''}
          </span>
        </div>
        
        <!-- Row 10 -->
        <div style="display: flex; margin-bottom: 15px;">
          <span style="width: 150px; font-weight: normal;">Average Monthly Income</span>
          <span style="flex: 1; border-bottom: 1px solid #000; margin-left: 0px; padding-bottom: 2px;">
            ${formatCurrency(formData.step1?.monthlyIncome) || ''}
          </span>
        </div>
      </div>

      <!-- Insurance Need Section -->
      <div style="margin-bottom: 20px;">
        <div style="background: #f0f0f0; padding: 8px; border-radius: 15px; display: inline-block; margin-bottom: 15px;">
          <span style="font-weight: normal;">Insurance Need</span>
        </div>
        
        <!-- Grid layout for insurance needs -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="margin-right: 10px;">1. Dependents Cost of Living</span>
              <div style="border: 1px solid #000; width: 20px; height: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">
                ${formData.step2?.insuranceNeeds?.dependentCostOfLiving ? '✓' : ''}
              </div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="margin-right: 10px;">3. Long Term Savings</span>
              <div style="border: 1px solid #000; width: 20px; height: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">
                ${formData.step2?.insuranceNeeds?.longTermSavings ? '✓' : ''}
              </div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="margin-right: 10px;">5. Pension Fund</span>
              <div style="border: 1px solid #000; width: 20px; height: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">
                ${formData.step2?.insuranceNeeds?.pensionFund ? '✓' : ''}
              </div>
            </div>
          </div>
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="margin-right: 10px;">2. Higher Education of Children</span>
              <div style="border: 1px solid #000; width: 20px; height: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">
                ${formData.step2?.insuranceNeeds?.higherEducationChildren ? '✓' : ''}
              </div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="margin-right: 10px;">4. Short Term Savings</span>
              <div style="border: 1px solid #000; width: 20px; height: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px;">
                ${formData.step2?.insuranceNeeds?.shortTermSavings ? '✓' : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Health Covers -->
        <div style="margin-bottom: 10px;">
          <span style="font-weight: normal;">6. Health Covers</span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="text-align: center;">
            <div style="font-size: 10px; margin-bottom: 5px;">1. Daily Hospitalization Expenses</div>
            <div style="border: 1px solid #000; width: 100%; height: 30px; display: flex; align-items: center; justify-content: center;">
              ${formData.step2?.healthCovers?.dailyHospitalizationExpenses ? '✓' : ''}
            </div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 10px; margin-bottom: 5px;">2. Surgery Cover</div>
            <div style="border: 1px solid #000; width: 100%; height: 30px; display: flex; align-items: center; justify-content: center;">
              ${formData.step2?.healthCovers?.surgeryCover ? '✓' : ''}
            </div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 10px; margin-bottom: 5px;">3. Hospital Bill Cover</div>
            <div style="border: 1px solid #000; width: 100%; height: 30px; display: flex; align-items: center; justify-content: center;">
              ${formData.step2?.healthCovers?.hospitalBillCover ? '✓' : ''}
            </div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 10px; margin-bottom: 5px;">4. Critical Illnesses</div>
            <div style="border: 1px solid #000; width: 100%; height: 30px; display: flex; align-items: center; justify-content: center;">
              ${formData.step2?.healthCovers?.criticalIllness ? '✓' : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Calculation Sections -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- Life Cover Calculation -->
        <div style="border: 2px solid #000; border-radius: 15px; padding: 15px; background: #f9f9f9;">
          <h4 style="margin: 0 0 15px 0; text-align: left; font-size: 11px; font-weight: bold;">Calculation of Life Cover</h4>
          
          <div style="margin-bottom: 10px;">
            <span style="font-size: 10px;">Fixed Monthly Expenses</span>
            <div style="border: 1px solid #000; width: 100%; height: 25px; margin-top: 3px; display: flex; align-items: center; padding: 0 5px; font-size: 10px;">
              ${formatCurrency(formData.step3?.fixedMonthlyExpenses) || ''}
            </div>
            <div style="text-align: right; margin-top: 2px; font-size: 10px;">x12x100 = Human Life Value</div>
          </div>

          <div style="margin-bottom: 10px;">
            <div style="border: 1px solid #000; width: 60%; height: 25px; margin-top: 3px; display: flex; align-items: center; padding: 0 5px; font-size: 10px;">
              ${formData.step3?.bankInterestRate ? `${formData.step3.bankInterestRate}%` : ''}
            </div>
            <div style="text-align: center; margin-top: 2px; font-size: 10px;">(Bank Interest Rate)</div>
          </div>

          <div style="margin-bottom: 10px;">
            <span style="font-size: 10px;">(Add) Unsecured Bank Loans</span>
            <span style="margin-left: 20px; font-size: 10px;"> = ........................</span>
          </div>

          <div style="margin-bottom: 15px;">
            <span style="font-size: 10px;">(Deduct) Cash in Hand + Insurance = ........................</span>
          </div>

          <div style="border-top: 1px solid #000; padding-top: 8px; text-align: center;">
            <div style="font-size: 10px; margin-bottom: 5px;">= ........................</div>
            <div style="font-size: 10px; font-weight: bold;">(Actual Human Life Value)</div>
          </div>
        </div>

        <!-- Permanent Disability Cover Calculation -->
        <div style="border: 2px solid #000; border-radius: 15px; padding: 15px; background: #f9f9f9;">
          <h4 style="margin: 0 0 15px 0; text-align: left; font-size: 11px; font-weight: bold;">Calculation of Permanent Disability Cover</h4>
          
          <div style="margin-bottom: 10px;">
            <div style="display: flex; align-items: center;">
              <span style="font-size: 10px;">Permanent Disability</span>
            </div>
            <div style="display: flex; align-items: center; margin-top: 3px;">
              <span style="font-size: 10px;">Cover = 120 Months</span>
              <span style="margin-left: 20px; font-size: 10px;"> = </span>
              <div style="border-bottom: 1px solid #000; width: 80px; height: 15px; margin-left: 5px;"></div>
            </div>
            <div style="text-align: right; font-size: 8px; font-style: italic; margin-top: 3px;">
              (It should not be equal to fixed monthly expenses)
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <span style="font-size: 10px; font-weight: bold;">Hospitalization</span>
          </div>

          <div style="margin-bottom: 6px; font-size: 10px;">
            <span>For Daily Hospitalization Expenses Rs. ........................</span>
          </div>

          <div style="margin-bottom: 6px; font-size: 10px;">
            <span>For Surgery (Maximum)</span>
            <span style="margin-left: 40px;">Rs ........................</span>
          </div>

          <div style="margin-bottom: 6px; font-size: 10px;">
            <span>Hospital Bill Claim (Per Annum)</span>
            <span style="margin-left: 20px;">Rs ........................</span>
          </div>

          <div style="margin-bottom: 10px; font-size: 10px;">
            <span>Critical Illness Cover</span>
            <span style="margin-left: 40px;"> = </span>
            <div style="border-bottom: 1px solid #000; width: 80px; height: 15px; display: inline-block; margin-left: 5px;"></div>
            <div style="text-align: right; font-size: 8px; margin-top: 2px;">(For 25 Diseases)</div>
          </div>

          <div style="font-size: 10px;">
            <span style="font-weight: bold;">Pension Fund</span>
            <div style="margin-top: 5px;">
              <span>From Age .... Rs................ Per Monthly For..... Years</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Signatures -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
        <div style="text-align: center;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto; padding-bottom: 5px;"></div>
          <div style="margin-top: 5px; font-size: 11px;">Signature of Customer</div>
        </div>
        <div style="text-align: center;">
          <div style="border-bottom: 2px solid #000; width: 200px; margin: 0 auto; padding-bottom: 5px;"></div>
          <div style="margin-top: 5px; font-size: 11px;">Signature of Insurance Advisor</div>
        </div>
      </div>
    </div>
  `
}