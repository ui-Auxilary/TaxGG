// TaxGG — Australian tax calculations, 2025-26. Pure functions, annual AUD. Estimates only.
// Sources: ato.gov.au/tax-rates-and-codes/{tax-rates-australian-residents, study-and-training-support-loans-rates-and-repayment-thresholds}

// Resident income tax brackets — 2025-26 (unchanged from 2024-25).
export const INCOME_TAX_BRACKETS = [
  { over: 0, upTo: 18200, rate: 0.0 },
  { over: 18200, upTo: 45000, rate: 0.16 },
  { over: 45000, upTo: 135000, rate: 0.3 },
  { over: 135000, upTo: 190000, rate: 0.37 },
  { over: 190000, upTo: Infinity, rate: 0.45 },
];

export const MEDICARE_LEVY_RATE = 0.02;

// Superannuation Guarantee rate — 11.5% for 2025-26.
export const DEFAULT_SUPER_RATE = 0.115;

// HELP/HECS marginal repayment bands — 2025-26; top tier is a flat 10% of whole income.
export const HELP_TOP_TIER_THRESHOLD = 179286;
export const HELP_TOP_TIER_RATE = 0.1;
export const HELP_REPAYMENT_BANDS = [
  { over: 0, upTo: 67000, rate: 0.0 },
  { over: 67000, upTo: 125000, rate: 0.15 },
  { over: 125000, upTo: HELP_TOP_TIER_THRESHOLD, rate: 0.17 },
];

// Sum marginal `rate` across each band the income reaches into.
function marginalAmount(income, bands) {
  let total = 0;
  for (const { over, upTo, rate } of bands) {
    if (income <= over) break;
    total += (Math.min(income, upTo) - over) * rate;
  }
  return total;
}

// Progressive income tax (PAYG) on taxable income.
export function calculateIncomeTax(taxableIncome) {
  return marginalAmount(taxableIncome, INCOME_TAX_BRACKETS);
}

// Flat Medicare levy (simplified — ignores low-income reduction).
export function calculateMedicareLevy(taxableIncome) {
  return taxableIncome * MEDICARE_LEVY_RATE;
}

// Compulsory HELP/HECS repayment; top tier is 10% of whole repayment income.
export function calculateHelpRepayment(repaymentIncome, hasLoan) {
  if (!hasLoan || repaymentIncome <= 0) return 0;
  if (repaymentIncome >= HELP_TOP_TIER_THRESHOLD) return repaymentIncome * HELP_TOP_TIER_RATE;
  return marginalAmount(repaymentIncome, HELP_REPAYMENT_BANDS);
}

// Superannuation Guarantee — paid by employer on top of gross.
export function calculateSuper(grossIncome, superRate = DEFAULT_SUPER_RATE) {
  return grossIncome * superRate;
}

// Full take-home breakdown for a salary + bonus, optionally with a student loan.
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

  return {
    grossIncome,
    taxableIncome,
    incomeTax,
    medicareLevy,
    helpRepayment,
    superContribution,
    totalWithheld,
    netIncome: grossIncome - totalWithheld,
    effectiveRate: grossIncome > 0 ? totalWithheld / grossIncome : 0,
  };
}

const safe = (n) => (Number.isFinite(n) ? n : 0);

export const fmtCurrency = (n) =>
  safe(n).toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export const fmtPercent = (n) => `${(safe(n) * 100).toFixed(1)}%`;
