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
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
    return `Rs. ${formattedAmount}`
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
      <div style="background: #1e3a8a; color: white; padding:20px; margin: -10mm -10mm 5px -10mm; border-radius: 5px 5px 5px 5px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: white;">Need Analysis</h1>
            <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: white;">Form</h2>
          </div>
          <div style="text-align: right;">
            <div style="background: #1e3a8a ; padding:20px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <img src="/images/logos/white_favicon.png" alt="Logo" style="height: 40px; width: auto;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div style="margin-bottom: 30px; margin-left: 0mm; margin-right: 0mm;">
        <div style="background: darkgrey; padding: 12px 12px 12px 12px; border-radius: 8px 8px 8px 8px; margin-bottom: 15px; text-align: center;">
          <h3 style="margin: 0; font-size: 20px; font-weight: bold; color: #333;">Personal Information</h3>
        </div>
        
        <!-- Personal Info without borders -->
        <div style="padding: 12px;">
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Full Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step1?.fullName || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Date of Birth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formatDate(formData.step1?.dateOfBirth) || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Spouse's Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step1?.spouseName || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">No of Children&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step1?.numberOfChildren || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Children's Ages&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step1?.childrenAges || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step1?.address || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Phone Number&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step1?.phoneNumber || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Occupation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step1?.occupation || ''}
            </span>
          </div>
          
          <div style="display: flex; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Monthly Income&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formatCurrency(formData.step1?.monthlyIncome) || ''}
            </span>
          </div>
        </div>
      </div>

      <!-- Insurance and Health Covers Section -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <!-- Insurance Section -->
        <div>
          <div style="background: darkgray; padding: 8px; border-radius: 8px 8px 8px 8px; margin-bottom: 10px; text-align: center;">
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
          <div style="background: darkgray; padding: 8px; border-radius: 8px 8px 8px 8px; margin-bottom: 10px; text-align: center;">
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
        <div style="background: darkgray; padding: 8px; border-radius: 8px 8px 8px 8px; margin-bottom: 10px; text-align: center;">
          <h4 style="margin: 0; font-size: 14px; font-weight: bold;">Life Cover</h4>
        </div>
        
        <div style="padding: 12px;">
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 200px; font-weight: bold; text-align: left; white-space: nowrap;">Fixed Monthly Expenses&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formatCurrency(formData.step3?.fixedMonthlyExpenses) || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 200px; font-weight: bold; text-align: left; white-space: nowrap;">Bank Interest Rate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formData.step3?.bankInterestRate ? formData.step3.bankInterestRate + '%' : ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 12px; align-items: center;">
            <span style="width: 200px; font-weight: bold; text-align: left; white-space: nowrap;">Unsecured Bank Loans&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formatCurrency(formData.step3?.unsecuredBankLoan) || ''}
            </span>
          </div>
          
          <div style="display: flex; margin-bottom: 15px; align-items: center;">
            <span style="width: 200px; font-weight: bold; text-align: left; white-space: nowrap;">Cash in Hand + Insurance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 10px; text-align: left;">
              ${formatCurrency(formData.step3?.cashInHandInsurance) || ''}
            </span>
          </div>
          
          <div style="padding-top: 12px; margin-top: 15px;">
            <div style="display: flex; align-items: center;">
              <span style="width: 200px; font-weight: bold; font-size: 14px; text-align: left; white-space: nowrap;">Actual Human Life Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
              <span style="flex: 1; padding-left: 10px; text-align: left; font-weight: bold; font-size: 13px;">
                ${formatCurrency(formData.step3?.actualHLValue) || '0'}
              </span>
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