// Answer many "total sales from day `from` up to (not including) day `to`" questions.
// Prefix sums: before[d] = total of days 0..d-1. Each answer is before[to] - before[from].
// O(n + q) time, O(n) extra memory, q = number of queries.
export function rangeTotals(sales: number[], queries: [from: number, to: number][]): number[] {
  const before = new Array<number>(sales.length + 1);
  before[0] = 0;
  for (let d = 0; d < sales.length; d++) before[d + 1] = before[d] + sales[d];
  return queries.map(([from, to]) => before[to] - before[from]);
}
