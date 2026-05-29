# TaxGG

Australian take-home pay estimator (React + Vite). Calculates income tax (PAYG),
Medicare levy, HELP/HECS student loan repayment, superannuation, and bonus impact
for the 2024-25 financial year.

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
