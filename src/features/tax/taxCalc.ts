import { marginalAmount } from "@/shared/finance";
import { INCOME_TAX_BRACKETS } from "./config/incomeTaxBrackets";
import {
  HELP_REPAYMENT_BANDS,
  HELP_TOP_TIER_RATE,
  HELP_TOP_TIER_THRESHOLD,
} from "./config/studentLoan";
import { DEFAULT_SUPER_RATE, MEDICARE_LEVY_RATE } from "./config/levies";
import type { TaxBreakdown, TaxBreakdownInput } from "./types";

export function calculateIncomeTax(taxableIncome: number): number {
  return marginalAmount(taxableIncome, INCOME_TAX_BRACKETS);
}

export function calculateMedicareLevy(taxableIncome: number): number {
  return taxableIncome * MEDICARE_LEVY_RATE;
}

export function calculateHelpRepayment(repaymentIncome: number, hasLoan: boolean): number {
  if (!hasLoan || repaymentIncome <= 0) return 0;
  if (repaymentIncome >= HELP_TOP_TIER_THRESHOLD) return repaymentIncome * HELP_TOP_TIER_RATE;
  return marginalAmount(repaymentIncome, HELP_REPAYMENT_BANDS);
}

export function calculateSuper(grossIncome: number, superRate: number = DEFAULT_SUPER_RATE): number {
  return grossIncome * superRate;
}

export function calculateBreakdown({
  salary = 0,
  bonus = 0,
  hasStudentLoan = false,
  superRate = DEFAULT_SUPER_RATE,
}: TaxBreakdownInput = {}): TaxBreakdown {
  const grossIncome = Math.max(0, salary) + Math.max(0, bonus);
  const taxableIncome = grossIncome;
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
