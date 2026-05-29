// ---------------------------------------------------------------
// TaxGG — Australian tax calculation logic (2024-25 financial year)
//
// Pure functions, no UI dependencies. All amounts are annual AUD.
// Figures are simplified estimates — not financial advice. Replace
// thresholds each financial year as the ATO updates them.
// ---------------------------------------------------------------

// Resident income tax brackets — 2024-25 (post Stage 3 cuts).
// Each entry: tax owed up to `upTo`, plus `rate` on income above `over`.
export const INCOME_TAX_BRACKETS = [
  { over: 0, upTo: 18200, rate: 0.0 },
  { over: 18200, upTo: 45000, rate: 0.16 },
  { over: 45000, upTo: 135000, rate: 0.3 },
  { over: 135000, upTo: 190000, rate: 0.37 },
  { over: 190000, upTo: Infinity, rate: 0.45 },
];

export const MEDICARE_LEVY_RATE = 0.02;

// Superannuation Guarantee rate — 11.5% for 2024-25.
export const DEFAULT_SUPER_RATE = 0.115;

// HELP/HECS student loan repayment thresholds — 2024-25.
// Repayment is `rate` applied to the WHOLE repayment income (not marginal).
export const HELP_REPAYMENT_BANDS = [
  { min: 0, rate: 0.0 },
  { min: 54435, rate: 0.01 },
  { min: 62851, rate: 0.02 },
  { min: 66621, rate: 0.025 },
  { min: 70619, rate: 0.03 },
  { min: 74856, rate: 0.035 },
  { min: 79347, rate: 0.04 },
  { min: 84108, rate: 0.045 },
  { min: 89155, rate: 0.05 },
  { min: 94504, rate: 0.055 },
  { min: 100175, rate: 0.06 },
  { min: 106186, rate: 0.065 },
  { min: 112557, rate: 0.07 },
  { min: 119310, rate: 0.075 },
  { min: 126468, rate: 0.08 },
  { min: 134057, rate: 0.085 },
  { min: 142101, rate: 0.09 },
  { min: 150627, rate: 0.095 },
  { min: 159664, rate: 0.1 },
];

/** Progressive income tax (PAYG) on taxable income. */
export function calculateIncomeTax(taxableIncome) {
  let tax = 0;
  for (const { over, upTo, rate } of INCOME_TAX_BRACKETS) {
    if (taxableIncome <= over) break;
    const amountInBand = Math.min(taxableIncome, upTo) - over;
    tax += amountInBand * rate;
  }
  return tax;
}

/** Flat Medicare levy (simplified — ignores low-income reduction). */
export function calculateMedicareLevy(taxableIncome) {
  return taxableIncome * MEDICARE_LEVY_RATE;
}

/** Compulsory HELP/HECS repayment based on repayment income. */
export function calculateHelpRepayment(repaymentIncome, hasLoan) {
  if (!hasLoan) return 0;
  let rate = 0;
  for (const band of HELP_REPAYMENT_BANDS) {
    if (repaymentIncome >= band.min) rate = band.rate;
    else break;
  }
  return repaymentIncome * rate;
}

/** Superannuation Guarantee — paid by employer on top of gross. */
export function calculateSuper(grossIncome, superRate = DEFAULT_SUPER_RATE) {
  return grossIncome * superRate;
}

/**
 * Full breakdown for a salary + bonus, optionally with a student loan.
 * @param {object} input
 * @param {number} input.salary       Base annual salary (AUD).
 * @param {number} input.bonus        Annual bonus (AUD).
 * @param {boolean} input.hasStudentLoan  Has HELP/HECS debt.
 * @param {number} input.superRate    SG rate as a fraction (e.g. 0.115).
 * @returns {object} full breakdown
 */
export function calculateBreakdown({
  salary = 0,
  bonus = 0,
  hasStudentLoan = false,
  superRate = DEFAULT_SUPER_RATE,
} = {}) {
  const grossIncome = Math.max(0, salary) + Math.max(0, bonus);
  const taxableIncome = grossIncome; // no deductions modelled yet

  const incomeTax = calculateIncomeTax(taxableIncome);
  const medicareLevy = calculateMedicareLevy(taxableIncome);
  const helpRepayment = calculateHelpRepayment(taxableIncome, hasStudentLoan);
  const superContribution = calculateSuper(grossIncome, superRate);

  const totalWithheld = incomeTax + medicareLevy + helpRepayment;
  const netIncome = grossIncome - totalWithheld;
  const effectiveRate = grossIncome > 0 ? totalWithheld / grossIncome : 0;

  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    medicareLevy,
    helpRepayment,
    superContribution,
    totalWithheld,
    netIncome,
    effectiveRate,
  };
}

export const fmtCurrency = (n) =>
  (Number.isFinite(n) ? n : 0).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });

export const fmtPercent = (n) => `${((Number.isFinite(n) ? n : 0) * 100).toFixed(1)}%`;
