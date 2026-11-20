// Binary search on a sorted array, written as two bounds: node bounds.ts
// Both search the half-open range [lo, hi) and keep one promise: every
// index before lo is too small, and every index from hi on is big enough.
import { bench } from "./bench.ts";

// The first index whose value is >= target, or a.length if there is none. O(log n), O(1) memory.
export function lowerBound(a: number[], target: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// The first index whose value is > target, or a.length if there is none. O(log n), O(1) memory.
export function upperBound(a: number[], target: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// A sorted log of n request times, and 1,000 times to look up.
type Lookups = { times: number[]; queries: number[] };
export function makeLookups(n: number): Lookups {
  const times: number[] = [];
  let t = 0;
  for (let i = 0; i < n; i++) times.push((t += Math.floor(Math.random() * 10))); // gaps of 0 to 9 seconds
  const queries = Array.from({ length: 1000 }, () => Math.floor(Math.random() * (t + 10)));
  return { times, queries };
}

// O(q * n): findIndex reads from the start for every lookup.
export const withFindIndex = ({ times, queries }: Lookups) =>
  queries.map((q) => { const i = times.findIndex((x) => x >= q); return i === -1 ? times.length : i; });
// The same scan as a plain loop. Also O(q * n).
export const withLoop = ({ times, queries }: Lookups) =>
  queries.map((q) => { let i = 0; while (i < times.length && times[i] < q) i++; return i; });
// O(q * log n).
export const withLowerBound = ({ times, queries }: Lookups) => queries.map((q) => lowerBound(times, q));

if (process.argv[1] === import.meta.filename) {
  const a = [1, 3, 7, 7, 7, 9];
  console.log("a = 1 3 7 7 7 9");
  console.log("lowerBound(a, 7):", lowerBound(a, 7), " upperBound(a, 7):", upperBound(a, 7));
  console.log("lowerBound(a, 4):", lowerBound(a, 4), " lowerBound(a, 10):", lowerBound(a, 10));
  const sample = makeLookups(10_000);
  const expected = String(withLowerBound(sample));
  console.log("same answers:", String(withFindIndex(sample)) === expected && String(withLoop(sample)) === expected);
  const sizes = [100_000, 200_000, 400_000];
  bench("findIndex, 1,000 lookups", sizes, makeLookups, withFindIndex);
  bench("plain loop, 1,000 lookups", sizes, makeLookups, withLoop);
  bench("lowerBound, 1,000 lookups", sizes, makeLookups, withLowerBound);
}
