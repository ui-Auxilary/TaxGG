import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateIncomeTax,
  calculateHelpRepayment,
  calculateSuper,
  calculateBreakdown,
} from "./taxCalc.js";

test("income tax: tax-free threshold", () => {
  assert.equal(calculateIncomeTax(18200), 0);
});

test("income tax: $45,000 -> $4,288", () => {
  // (45000 - 18200) * 0.16 = 4288
  assert.equal(calculateIncomeTax(45000), 4288);
});

test("income tax: $100,000 -> $20,788", () => {
  // 4288 + (100000 - 45000) * 0.30 = 4288 + 16500 = 20788
  assert.equal(calculateIncomeTax(100000), 20788);
});

test("super: 11.5% of gross", () => {
  assert.equal(calculateSuper(100000, 0.115), 11500);
});

test("HELP: below $67,000 threshold pays nothing", () => {
  assert.equal(calculateHelpRepayment(67000, true), 0);
});

test("HELP: marginal 15c over $67,000", () => {
  // $100,000: (100000 - 67000) * 0.15 = 4950
  assert.equal(calculateHelpRepayment(100000, true), 4950);
});

test("HELP: marginal third band $8,700 + 17c over $125,000", () => {
  // $150,000: 8700 + (150000 - 125000) * 0.17 = 8700 + 4250 = 12950
  assert.equal(calculateHelpRepayment(150000, true), 12950);
});

test("HELP: schedule is continuous at the $179,285 top-tier boundary", () => {
  // marginal: 8700 + (179285 - 125000) * 0.17 = 17928.45
  // top tier: 179285 * 0.10                    = 17928.50  (≈ equal)
  const marginal = calculateHelpRepayment(179285, true);
  const topTier = 179286 * 0.1;
  assert.ok(Math.abs(marginal - topTier) < 1);
});

test("HELP: top tier is 10% of whole income", () => {
  assert.equal(calculateHelpRepayment(200000, true), 20000);
});

test("HELP: ignored when no loan", () => {
  assert.equal(calculateHelpRepayment(200000, false), 0);
});

test("breakdown: bonus is added to gross & taxed", () => {
  const noBonus = calculateBreakdown({ salary: 90000 });
  const withBonus = calculateBreakdown({ salary: 90000, bonus: 10000 });
  assert.ok(withBonus.grossIncome === 100000);
  assert.ok(withBonus.incomeTax > noBonus.incomeTax);
  assert.ok(withBonus.netIncome > noBonus.netIncome);
});

test("breakdown: net = gross - withholdings, super on top", () => {
  const r = calculateBreakdown({ salary: 100000, hasStudentLoan: false });
  assert.equal(r.netIncome, r.grossIncome - r.totalWithheld);
  assert.equal(r.superContribution, 11500);
});
