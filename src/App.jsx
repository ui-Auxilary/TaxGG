import { useMemo, useState } from "react";
import { calculateBreakdown, DEFAULT_SUPER_RATE, fmtCurrency, fmtPercent } from "./taxCalc.js";

const num = (v) => parseFloat(v) || 0;

export default function App() {
  const [salary, setSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [hasStudentLoan, setHasStudentLoan] = useState(false);
  const [superRate, setSuperRate] = useState(DEFAULT_SUPER_RATE * 100);

  const result = useMemo(
    () =>
      calculateBreakdown({
        salary: num(salary),
        bonus: num(bonus),
        hasStudentLoan,
        superRate: num(superRate) / 100,
      }),
    [salary, bonus, hasStudentLoan, superRate]
  );

  const hasInput = num(salary) > 0 || num(bonus) > 0;

  return (
    <div className="page">
      <div className="card">
        <header>
          <h1>
            Tax<span>GG</span>
          </h1>
          <p className="subtitle">Australian take-home pay estimate · 2025-26</p>
        </header>

        <NumberField id="salary" label="Base Annual Salary" step="1000" value={salary} onChange={setSalary} />
        <NumberField id="bonus" label="Annual Bonus" step="500" value={bonus} onChange={setBonus} />
        <NumberField id="superRate" label="Superannuation Rate (%)" step="0.5" value={superRate} onChange={setSuperRate} />

        <label className="checkbox">
          <input type="checkbox" checked={hasStudentLoan} onChange={(e) => setHasStudentLoan(e.target.checked)} />
          I have a HELP / HECS student loan
        </label>

        {hasInput && (
          <div className="results show">
            <Row label="Gross Income" value={fmtCurrency(result.grossIncome)} />
            <Row label="Income Tax (PAYG)" value={`− ${fmtCurrency(result.incomeTax)}`} />
            <Row label="Medicare Levy" value={`− ${fmtCurrency(result.medicareLevy)}`} />
            {hasStudentLoan && (
              <Row label="HELP / HECS Repayment" value={`− ${fmtCurrency(result.helpRepayment)}`} />
            )}
            <Row label="Effective Tax Rate" value={fmtPercent(result.effectiveRate)} muted />
            <Row label="Net (Take-Home)" value={fmtCurrency(result.netIncome)} total />
            <Row label="Super (paid on top)" value={`+ ${fmtCurrency(result.superContribution)}`} accent />
          </div>
        )}

        <p className="disclaimer">Estimates only — simplified resident rates, not financial advice.</p>
      </div>
    </div>
  );
}

function NumberField({ id, label, step, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" min="0" step={step} placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Row({ label, value, total, accent, muted }) {
  const cls = ["row", total && "total", accent && "accent-row", muted && "muted-row"].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      <span className="lbl">{label}</span>
      <span className="val">{value}</span>
    </div>
  );
}
