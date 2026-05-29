import { useMemo, useState } from "react";
import { NumberField } from "@/components/NumberField";
import { ResultRow } from "@/components/ResultRow";
import { formatCurrency, formatPercent } from "@/shared/format";
import { calculateBreakdown } from "./taxCalc";
import { DEFAULT_SUPER_RATE } from "./config/levies";

const toNumber = (value: string): number => parseFloat(value) || 0;

export function TaxCalculator() {
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [hasStudentLoan, setHasStudentLoan] = useState(false);
  const [superRate, setSuperRate] = useState(String(DEFAULT_SUPER_RATE * 100));

  const breakdown = useMemo(
    () =>
      calculateBreakdown({
        salary: toNumber(salary),
        bonus: toNumber(bonus),
        hasStudentLoan,
        superRate: toNumber(superRate) / 100,
      }),
    [salary, bonus, hasStudentLoan, superRate]
  );

  const hasInput = toNumber(salary) > 0 || toNumber(bonus) > 0;

  return (
    <section className="card">
      <header>
        <h1>Income Tax</h1>
        <p className="subtitle">Australian take-home pay estimate · 2025-26</p>
      </header>

      <NumberField id="salary" label="Base Annual Salary" step="1000" value={salary} onChange={setSalary} />
      <NumberField id="bonus" label="Annual Bonus" step="500" value={bonus} onChange={setBonus} />
      <NumberField id="superRate" label="Superannuation Rate (%)" step="0.5" value={superRate} onChange={setSuperRate} />

      <label className="checkbox">
        <input
          type="checkbox"
          checked={hasStudentLoan}
          onChange={(event) => setHasStudentLoan(event.target.checked)}
        />
        I have a HELP / HECS student loan
      </label>

      {hasInput && (
        <div className="results show">
          <ResultRow label="Gross Income" value={formatCurrency(breakdown.grossIncome)} />
          <ResultRow label="Income Tax (PAYG)" value={`− ${formatCurrency(breakdown.incomeTax)}`} />
          <ResultRow label="Medicare Levy" value={`− ${formatCurrency(breakdown.medicareLevy)}`} />
          {hasStudentLoan && (
            <ResultRow
              label="HELP / HECS Repayment"
              value={`− ${formatCurrency(breakdown.helpRepayment)}`}
            />
          )}
          <ResultRow label="Effective Tax Rate" value={formatPercent(breakdown.effectiveRate)} variant="muted" />
          <ResultRow label="Net (Take-Home)" value={formatCurrency(breakdown.netIncome)} variant="total" />
          <ResultRow
            label="Super (paid on top)"
            value={`+ ${formatCurrency(breakdown.superContribution)}`}
            variant="accent"
          />
        </div>
      )}

      <p className="disclaimer">Estimates only — simplified resident rates, not financial advice.</p>
    </section>
  );
}
