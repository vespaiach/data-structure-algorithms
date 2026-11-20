// Common mistakes with binary search and greedy choices, and the wrong output each one gives: node mistakes.ts
import { lowerBound } from "./bounds.ts";

// 1. lo = mid instead of lo = mid + 1: when hi = lo + 1, mid is lo again and
// the range never shrinks. (Capped so the script ends.)
function lowerBoundStuck(a: number[], target: number): string {
  let lo = 0, hi = a.length;
  for (let steps = 0; lo < hi; steps++) {
    if (steps > 50) return `stuck at lo=${lo} hi=${hi}`;
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] < target) lo = mid; // should be mid + 1
    else hi = mid;
  }
  return String(lo);
}
console.log("1. lo = mid:", lowerBoundStuck([1, 3, 5, 7], 6));

// 2. Stopping at the first match: with repeated values it returns some
// matching index, not the first one.
function findAny(a: number[], target: number): number {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
const repeated = [7, 7, 7, 7, 9];
console.log("2. stop at first match:", findAny(repeated, 7), " lowerBound:", lowerBound(repeated, 7));

// 3. Binary search on data that is not sorted: no error, just a wrong answer.
const unsorted = [5, 1, 9, 3, 7];
console.log("3. lowerBound on unsorted for 3:", lowerBound(unsorted, 3), " (3 is at index", unsorted.indexOf(3) + ")");

// 4. hi = a.length - 1 with a half-open loop: index a.length, "none", can never come out.
function lowerBoundShort(a: number[], target: number): number {
  let lo = 0, hi = a.length - 1; // should be a.length
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
console.log("4. hi = length - 1, first >= 9 in [1,3,5]:", lowerBoundShort([1, 3, 5], 9), " lowerBound:", lowerBound([1, 3, 5], 9));

// 5. Closed intervals where the problem means half-open: a meeting ending at
// 10 and one starting at 10 are counted as overlapping.
const ms: [number, number][] = [[9, 10], [10, 11], [11, 12]];
let free = -Infinity, takenStrict = 0;
for (const [s, e] of ms) if (s > free) { takenStrict++; free = e; } // should be s >= free
console.log("5. with s > free:", takenStrict, "meetings (expected 3)");
