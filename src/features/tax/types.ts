export interface TaxBreakdownInput {
  salary?: number;
  bonus?: number;
  hasStudentLoan?: boolean;
  superRate?: number;
}

export interface TaxBreakdown {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  helpRepayment: number;
  superContribution: number;
  totalWithheld: number;
  netIncome: number;
  effectiveRate: number;
}
