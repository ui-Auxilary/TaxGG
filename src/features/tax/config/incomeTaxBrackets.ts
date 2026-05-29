import type { Band } from "@/shared/finance";

// Resident income tax brackets, 2025-26.
// Source: ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
export const INCOME_TAX_BRACKETS: Band[] = [
  { over: 0, upTo: 18200, rate: 0.0 },
  { over: 18200, upTo: 45000, rate: 0.16 },
  { over: 45000, upTo: 135000, rate: 0.3 },
  { over: 135000, upTo: 190000, rate: 0.37 },
  { over: 190000, upTo: Infinity, rate: 0.45 },
];
