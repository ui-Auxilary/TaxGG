export interface Band {
  over: number;
  upTo: number;
  rate: number;
}

// Sum each band's rate applied to the portion of income that falls within it.
export function marginalAmount(income: number, bands: Band[]): number {
  let total = 0;
  for (const { over, upTo, rate } of bands) {
    if (income <= over) break;
    total += (Math.min(income, upTo) - over) * rate;
  }
  return total;
}
