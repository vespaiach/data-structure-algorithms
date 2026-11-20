// Two more shapes: a count with two bounds, and merging intervals: node variations.ts
import { lowerBound, upperBound } from "./bounds.ts";
import type { Meeting } from "./meetings.ts";

// How many values of a sorted array fall in [from, to], both ends included. O(log n), O(1) memory.
export function countBetween(a: number[], from: number, to: number): number {
  if (from > to) return 0;
  return upperBound(a, to) - lowerBound(a, from);
}

// Merge busy times into blocks: sort by start, then extend the last block while the
// next interval starts inside it. Half-open, so [8, 10) and [10, 12) stay apart.
// O(n log n) time, O(n) memory.
export function mergeBusy(ms: Meeting[]): Meeting[] {
  const out: Meeting[] = [];
  for (const [start, end] of ms.toSorted((a, b) => a[0] - b[0])) {
    const last = out.at(-1);
    if (last && start < last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }
  return out;
}

if (process.argv[1] === import.meta.filename) {
  const a = [1, 3, 7, 7, 7, 9];
  console.log("countBetween(a, 3, 7):", countBetween(a, 3, 7), " bounds:", lowerBound(a, 3), upperBound(a, 7));
  console.log("countBetween(a, 4, 6):", countBetween(a, 4, 6), " bounds:", lowerBound(a, 4), upperBound(a, 6));
  console.log("mergeBusy:", JSON.stringify(mergeBusy([[8, 10], [1, 3], [2, 6], [15, 18], [10, 12]])));
}
