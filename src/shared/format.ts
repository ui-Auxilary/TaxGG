const numberOrZero = (value: number): number => (Number.isFinite(value) ? value : 0);

export const formatCurrency = (value: number): string =>
  numberOrZero(value).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });

export const formatPercent = (value: number): string => `${(numberOrZero(value) * 100).toFixed(1)}%`;
