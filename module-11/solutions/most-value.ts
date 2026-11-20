// Exercise 4: each booking is [start, end, value] for one room, half-open [start, end) with
// end > start, so a booking that ends at 10 and one that starts at 10 fit together. Returns the
// largest total value of bookings that don't overlap. You may import Module 9's bounds:
// import { lowerBound, upperBound } from "../../module-09/bounds.ts";
import { upperBound } from "../../module-09/bounds.ts";

export type Booking = [start: number, end: number, value: number];

// Sort by end. State: best[i] = the most value from the first i bookings in that order.
// Skip booking i - 1, or take it plus the best of the bookings that end by its start:
// best[i] = max(best[i - 1], best[p] + value), where p = upperBound(ends, start) counts the
// bookings that end at or before the start (all of them come before i - 1, because end > start).
// O(n log n) time for the sort and n binary searches, O(n) memory.
export function mostValue(bookings: Booking[]): number {
  const byEnd = bookings.toSorted((x, y) => x[1] - y[1]);
  const ends = byEnd.map((b) => b[1]);
  const best = new Array<number>(byEnd.length + 1).fill(0);
  for (let i = 1; i <= byEnd.length; i++) {
    const [start, , value] = byEnd[i - 1];
    best[i] = Math.max(best[i - 1], best[upperBound(ends, start)] + value);
  }
  return best[byEnd.length];
}
