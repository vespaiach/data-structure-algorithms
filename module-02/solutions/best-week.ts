// The k consecutive days with the highest total sales: return the first day and the total.
// Fixed window: add the day that enters, subtract the day that leaves.
// O(n) time, O(1) extra memory.
export function bestWeek(sales: number[], k: number): { start: number; total: number } {
  if (k <= 0 || k > sales.length) throw new RangeError("k must be between 1 and sales.length");
  let total = 0;
  for (let i = 0; i < k; i++) total += sales[i];
  let best = { start: 0, total };
  for (let end = k; end < sales.length; end++) {
    total += sales[end] - sales[end - k];
    if (total > best.total) best = { start: end - k + 1, total };
  }
  return best;
}
