// Exercise 4, slow answer: the same table, but p is found by scanning back from i - 1 for the
// last booking that ends by the start. Correct, but O(n^2) in the worst case.
export type Booking = [start: number, end: number, value: number];

export function mostValue(bookings: Booking[]): number {
  const byEnd = bookings.toSorted((x, y) => x[1] - y[1]);
  const best = new Array<number>(byEnd.length + 1).fill(0);
  for (let i = 1; i <= byEnd.length; i++) {
    const [start, , value] = byEnd[i - 1];
    let p = i - 1;
    while (p > 0 && byEnd[p - 1][1] > start) p--;
    best[i] = Math.max(best[i - 1], best[p] + value);
  }
  return best[byEnd.length];
}
