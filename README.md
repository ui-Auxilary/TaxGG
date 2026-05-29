# TaxGG

Australian take-home pay estimator (React + Vite). Calculates income tax (PAYG),
Medicare levy, HELP/HECS student loan repayment, superannuation, and bonus impact
for the 2025-26 financial year.

Rates sourced from the ATO:
[resident tax rates](https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents)
and [study/training loan thresholds](https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds).
Note HELP/HECS uses **marginal** repayment rates from 2025-26 onward.

> Estimates only — simplified resident rates, not financial advice.

## Develop

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm test         # run calculation tests
```

Calculation logic lives in `src/taxCalc.js` (pure functions, covered by
`src/taxCalc.test.js`). UI is in `src/App.jsx`.
