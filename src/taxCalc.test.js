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

test("HELP: below threshold pays nothing", () => {
  assert.equal(calculateHelpRepayment(50000, true), 0);
});

test("HELP: top band is 10% of whole income", () => {
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
