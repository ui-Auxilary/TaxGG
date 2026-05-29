import { test, expect } from "vitest";
import {
  calculateBreakdown,
  calculateHelpRepayment,
  calculateIncomeTax,
  calculateSuper,
} from "./taxCalc";

test("income tax is nil at the tax-free threshold", () => {
  expect(calculateIncomeTax(18200)).toBe(0);
});

test("income tax: $45,000 = $4,288", () => {
  expect(calculateIncomeTax(45000)).toBe(4288);
});

test("income tax: $100,000 = $20,788", () => {
  expect(calculateIncomeTax(100000)).toBe(20788);
});

test("super is the SG rate of gross", () => {
  expect(calculateSuper(100000, 0.115)).toBe(11500);
});

test("HELP: below the $67,000 threshold pays nothing", () => {
  expect(calculateHelpRepayment(67000, true)).toBe(0);
});

test("HELP: 15c marginal over $67,000", () => {
  expect(calculateHelpRepayment(100000, true)).toBe(4950);
});

test("HELP: third band is $8,700 + 17c over $125,000", () => {
  expect(calculateHelpRepayment(150000, true)).toBe(12950);
});

test("HELP: schedule is continuous at the top-tier boundary", () => {
  const marginal = calculateHelpRepayment(179285, true);
  expect(Math.abs(marginal - 179286 * 0.1)).toBeLessThan(1);
});

test("HELP: top tier is 10% of whole income", () => {
  expect(calculateHelpRepayment(200000, true)).toBe(20000);
});

test("HELP: ignored when the user has no loan", () => {
  expect(calculateHelpRepayment(200000, false)).toBe(0);
});

test("breakdown: bonus is added to gross and taxed", () => {
  const noBonus = calculateBreakdown({ salary: 90000 });
  const withBonus = calculateBreakdown({ salary: 90000, bonus: 10000 });
  expect(withBonus.grossIncome).toBe(100000);
  expect(withBonus.incomeTax).toBeGreaterThan(noBonus.incomeTax);
  expect(withBonus.netIncome).toBeGreaterThan(noBonus.netIncome);
});

test("breakdown: net = gross - withholdings, super on top", () => {
  const result = calculateBreakdown({ salary: 100000, hasStudentLoan: false });
  expect(result.netIncome).toBe(result.grossIncome - result.totalWithheld);
  expect(result.superContribution).toBe(11500);
});
