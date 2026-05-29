import type { Band } from "@/shared/finance";

// HELP/HECS marginal repayment bands, 2025-26; top tier is a flat 10% of whole income.
// Source: ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds
export const HELP_TOP_TIER_THRESHOLD = 179286;
export const HELP_TOP_TIER_RATE = 0.1;
export const HELP_REPAYMENT_BANDS: Band[] = [
  { over: 0, upTo: 67000, rate: 0.0 },
  { over: 67000, upTo: 125000, rate: 0.15 },
  { over: 125000, upTo: HELP_TOP_TIER_THRESHOLD, rate: 0.17 },
];
