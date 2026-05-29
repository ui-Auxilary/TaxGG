// ---------------------------------------------------------------
// TaxGG — Australian tax calculation logic (2025-26 financial year)
//
// Pure functions, no UI dependencies. All amounts are annual AUD.
// Figures are simplified estimates — not financial advice. Replace
// thresholds each financial year as the ATO updates them.
//
// Sources (ATO):
//   Resident tax rates:
//     ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
//   Study/training loan (HELP/HECS) thresholds:
//     ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds
// ---------------------------------------------------------------

// Resident income tax brackets — 2025-26 (unchanged from 2024-25).
// Each entry: `rate` applies to income between `over` and `upTo`.
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

// HELP/HECS student loan repayment — 2025-26.
// From 2025-26 the ATO uses MARGINAL rates: repayment applies only to the
// repayment income above each threshold (not a flat % of the whole income).
// The top tier is a flat 10% of total repayment income — this meets the
// marginal schedule continuously at $179,285.
export const HELP_TOP_TIER_THRESHOLD = 179286;
export const HELP_TOP_TIER_RATE = 0.1;
export const HELP_REPAYMENT_BANDS = [
  { over: 0, upTo: 67000, rate: 0.0 },
  { over: 67000, upTo: 125000, rate: 0.15 },
  { over: 125000, upTo: HELP_TOP_TIER_THRESHOLD, rate: 0.17 },
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

/**
 * Compulsory HELP/HECS repayment based on repayment income (2025-26 marginal).
 * Top tier ($179,286+) is a flat 10% of total repayment income.
 */
export function calculateHelpRepayment(repaymentIncome, hasLoan) {
  if (!hasLoan || repaymentIncome <= 0) return 0;
  if (repaymentIncome >= HELP_TOP_TIER_THRESHOLD) {
    return repaymentIncome * HELP_TOP_TIER_RATE;
  }
  let repayment = 0;
  for (const { over, upTo, rate } of HELP_REPAYMENT_BANDS) {
    if (repaymentIncome <= over) break;
    repayment += (Math.min(repaymentIncome, upTo) - over) * rate;
  }
  return repayment;
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
