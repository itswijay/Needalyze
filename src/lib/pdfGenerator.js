import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const generatePDF = async (formData) => {
  try {
    // Create a temporary container for the PDF content
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '210mm' // A4 width
    tempContainer.style.height = '297mm' // A4 height
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
    
    // A4 dimensions in mm
    const pageWidth = 210
    const pageHeight = 297
    
    // Calculate the image dimensions to fit the page with margins
    const margin = 10
    const maxWidth = pageWidth - (2 * margin)
    const maxHeight = pageHeight - (2 * margin)
    
    const imgWidth = maxWidth
    const imgHeight = (canvas.height * maxWidth) / canvas.width
    
    // If the image is taller than the page, scale it down
    let finalWidth = imgWidth
    let finalHeight = imgHeight
    
    if (imgHeight > maxHeight) {
      finalHeight = maxHeight
      finalWidth = (canvas.width * maxHeight) / canvas.height
    }
    
    // Center the image on the page
    const x = (pageWidth - finalWidth) / 2
    const y = (pageHeight - finalHeight) / 2
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
    
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
      padding: 10mm; 
      font-family: Arial, sans-serif; 
      font-size: 12px; 
      line-height: 1.4; 
      color: #000; 
      width: 190mm; 
      min-height: 277mm;
      margin: 0 auto;
      box-sizing: border-box;
      position: relative;
    ">
      <!-- Dark Blue Header with Logo -->
      <div style="background: #1e3a8a; color: white; padding: 15px; margin: -10mm -10mm 20px -10mm; border-bottom: 3px solid #000;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: white;">Need Analysis</h1>
            <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: white;">Form</h2>
          </div>
          <div style="text-align: right;">
            <div style="background: white; color: #1e3a8a; padding: 8px 16px; border-radius: 8px; font-size: 16px; font-weight: bold;">
              NEEDALYZE
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div style="margin-bottom: 20px;">
        <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: bold; color: #333;">Personal Information</h3>
        </div>
        
        <!-- Personal Info without borders -->
        <div style="padding: 12px;">
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">Full Name:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formData.step1?.fullName || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">Date of Birth:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formatDate(formData.step1?.dateOfBirth) || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">Spouse's Name:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formData.step1?.spouseName || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">No of Children:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formData.step1?.numberOfChildren || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">Children's Ages:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formData.step1?.childrenAges || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">Address:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formData.step1?.address || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">Phone Number:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formData.step1?.phoneNumber || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 10px;">
            <span style="width: 110px; font-weight: bold;">Occupation:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formData.step1?.occupation || ''}
            </span>
          </div>
          
          <div style="display: flex;">
            <span style="width: 110px; font-weight: bold;">Monthly Income:</span>
            <span style="flex: 1; padding-bottom: 3px; margin-left: 8px;">
              ${formatCurrency(formData.step1?.monthlyIncome) || ''}
            </span>
          </div>
        </div>
      </div>

      <!-- Insurance and Health Covers Section -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <!-- Insurance Section -->
        <div>
          <div style="background: #f8f9fa; padding: 8px; border-radius: 5px; margin-bottom: 10px; text-align: center;">
            <h4 style="margin: 0; font-size: 13px; font-weight: bold;">Insurance</h4>
          </div>
          <div style="padding: 10px; height: 120px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.insuranceNeeds?.dependentCostOfLiving ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Dependents Cost</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.insuranceNeeds?.higherEducationChildren ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Education</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.insuranceNeeds?.longTermSavings ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Long Term Savings</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.insuranceNeeds?.pensionFund ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Pension Fund</span>
            </div>
          </div>
        </div>

        <!-- Health Covers Section -->
        <div>
          <div style="background: #f8f9fa; padding: 8px; border-radius: 5px; margin-bottom: 10px; text-align: center;">
            <h4 style="margin: 0; font-size: 13px; font-weight: bold;">Health Covers</h4>
          </div>
          <div style="padding: 10px; height: 120px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.healthCovers?.dailyHospitalizationExpenses ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Daily Hospitalization</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.healthCovers?.surgeryCover ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Surgery Cover</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.healthCovers?.hospitalBillCover ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Hospital Bill</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${formData.step2?.healthCovers?.criticalIllness ? '✓' : ''}
              </div>
              <span style="font-size: 10px;">Critical Illness</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Life Cover Calculation -->
      <div style="margin-bottom: 20px;">
        <div style="background: #f8f9fa; padding: 8px; border-radius: 5px; margin-bottom: 10px;">
          <h4 style="margin: 0; font-size: 14px; font-weight: bold;">Life Cover</h4>
        </div>
        
        <div style="padding: 12px;">
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 140px; font-weight: bold;">Fixed Monthly Expenses:</span>
            <div style="width: 130px; height: 28px; margin-left: 8px; display: flex; align-items: center; padding: 0 6px;">
              ${formatCurrency(formData.step3?.fixedMonthlyExpenses) || ''}
            </div>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 140px; font-weight: bold;">Bank Interest Rate:</span>
            <div style="width: 130px; height: 28px; margin-left: 8px; display: flex; align-items: center; padding: 0 6px;">
              ${formData.step3?.bankInterestRate ? formData.step3.bankInterestRate + '%' : ''}
            </div>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 140px; font-weight: bold;">Unsecured Bank Loans:</span>
            <div style="width: 130px; height: 28px; margin-left: 8px; display: flex; align-items: center; padding: 0 6px;">
              ${formatCurrency(formData.step3?.unsecuredBankLoan) || ''}
            </div>
          </div>
          
          <div style="display: flex; margin-bottom: 15px; align-items: center;">
            <span style="width: 140px; font-weight: bold;">Cash in Hand + Insurance:</span>
            <div style="width: 130px; height: 28px; margin-left: 8px; display: flex; align-items: center; padding: 0 6px;">
              ${formatCurrency(formData.step3?.cashInHandInsurance) || ''}
            </div>
          </div>
          
          <div style="padding-top: 12px; margin-top: 15px;">
            <div style="display: flex; align-items: center;">
              <span style="width: 140px; font-weight: bold; font-size: 14px;">Actual Human Life Value:</span>
              <div style="width: 150px; height: 32px; margin-left: 8px; display: flex; align-items: center; padding: 0 6px; font-weight: bold; font-size: 13px;">
                ${formatCurrency(formData.step3?.actualHLValue) || '0'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 25px; text-align: center; font-size: 10px; color: #666; padding-top: 12px;">
        Generated by Needalyze Insurance Analysis System | ${new Date().toLocaleDateString('en-IN')}
      </div>
    </div>
  `
}