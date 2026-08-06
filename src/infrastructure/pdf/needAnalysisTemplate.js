import { formatCurrency } from '@/domain/services/money'
import {
  HEALTH_COVERS,
  INSURANCE_NEEDS,
} from '@/domain/constants/needCategories'

/**
 * The printed need-analysis form.
 *
 * Markup is unchanged from the version that lived inside lib/pdfGenerator.js —
 * only the data accessors moved onto the draft view model and the hardcoded
 * category keys onto the domain constants. Note the insurance column shows four
 * of the five needs: "short term savings" has never appeared on the printed
 * form, and that is preserved here rather than quietly changed.
 *
 * @param {import('@/application/view-models/needAnalysisDraft').emptyDraft} formData
 * @returns {string} a complete HTML document fragment
 */
export function renderNeedAnalysisHtml(formData) {
  const tick = (on) => (on ? '✓' : '')
  const needs = formData.step2?.insuranceNeeds || {}
  const covers = formData.step2?.healthCovers || {}

  return `
    <div style="
      background: white;
      padding: 8mm;
      font-family: Arial, sans-serif;
      font-size: 11px;
      line-height: 1.3;
      color: #000;
      width: 194mm;
      min-height: 281mm;
      margin: 0 auto;
      box-sizing: border-box;
      position: relative;
    ">
      <!-- Dark Blue Header with Logo -->
      <div style="background: #1e3a8a; color: white; padding:15px; margin: -8mm -8mm 4px -8mm; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: white;">Need Analysis</h1>
            <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: white;">Form</h2>
          </div>
          <div style="text-align: right;">
            <div style="background: #1e3a8a ; padding:15px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <img src="/images/logos/white_favicon.png" alt="Logo" style="height: 32px; width: auto;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div style="margin-bottom: 25px; margin-left: 0mm; margin-right: 0mm;">
        <div style="background: darkgrey; padding: 10px; border-radius: 6px; margin-bottom: 12px; text-align: center;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #333;">Personal Information</h3>
        </div>

        <!-- Personal Info without borders -->
        <div style="padding: 10px;">
          <div style="display: flex; margin-bottom: 8px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Full Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 8px; text-align: left;">
              ${formData.step1?.fullName || ''}
            </span>
          </div>

          <div style="display: flex; margin-bottom: 8px; align-items: center;">
            <span style="width: 160px; font-weight: bold; text-align: left;">Date of Birth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span style="flex: 1; padding-left: 8px; text-align: left;">
              ${formatDate(formData.step1?.dateOfBirth) || ''}
            </span>
          </div>

          <div style="display: flex; margin-bottom: 8px; align-items: center;">
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
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <!-- Insurance Section -->
        <div>
          <div style="background: darkgray; padding: 6px; border-radius: 6px; margin-bottom: 8px; text-align: center;">
            <h4 style="margin: 0; font-size: 12px; font-weight: bold;">Insurance</h4>
          </div>
          <div style="padding: 8px; height: 100px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(needs[INSURANCE_NEEDS.DEPENDENT_COST_OF_LIVING])}
              </div>
              <span style="font-size: 10px;">Dependents Cost</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(needs[INSURANCE_NEEDS.HIGHER_EDUCATION_CHILDREN])}
              </div>
              <span style="font-size: 10px;">Education</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(needs[INSURANCE_NEEDS.LONG_TERM_SAVINGS])}
              </div>
              <span style="font-size: 10px;">Long Term Savings</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(needs[INSURANCE_NEEDS.PENSION_FUND])}
              </div>
              <span style="font-size: 10px;">Pension Fund</span>
            </div>
          </div>
        </div>

        <!-- Health Covers Section -->
        <div>
          <div style="background: darkgray; padding: 6px; border-radius: 6px; margin-bottom: 8px; text-align: center;">
            <h4 style="margin: 0; font-size: 12px; font-weight: bold;">Health Covers</h4>
          </div>
          <div style="padding: 8px; height: 100px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(covers[HEALTH_COVERS.DAILY_HOSPITALIZATION_EXPENSES])}
              </div>
              <span style="font-size: 10px;">Daily Hospitalization</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(covers[HEALTH_COVERS.SURGERY_COVER])}
              </div>
              <span style="font-size: 10px;">Surgery Cover</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(covers[HEALTH_COVERS.HOSPITAL_BILL_COVER])}
              </div>
              <span style="font-size: 10px;">Hospital Bill</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 16px; height: 16px; margin-right: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                ${tick(covers[HEALTH_COVERS.CRITICAL_ILLNESS])}
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
              ${
                formData.step3?.bankInterestRate
                  ? formData.step3.bankInterestRate + '%'
                  : ''
              }
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
                ${formatCurrency(formData.step3?.humanLifeValue) || '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 25px; text-align: center; font-size: 10px; color: #666; padding-top: 12px;">
        Generated by Needalyze Insurance Analysis System | ${new Date().toLocaleDateString(
          'en-IN'
        )}
      </div>
    </div>
  `
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * The filename a generated report is saved under.
 *
 * @param {string} customerName
 * @param {Date} [now]
 */
export function needAnalysisFilename(customerName, now = new Date()) {
  const date = now.toLocaleDateString('en-IN').replace(/\//g, '-')
  const name = (customerName || 'Customer').replace(/\s+/g, '_')
  return `Need_Analysis_${name}_${date}.pdf`
}
