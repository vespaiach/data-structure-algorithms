// Other ways to get the top k, and where the heap stops winning: node alternatives.ts
import { bench } from "./bench.ts";
import { makeScores, topTenSort } from "./opening-slow.ts";
import { topKHeap } from "./opening-fast.ts";

// A typed array sorts numbers by value with no comparison function. Still O(n log n), O(n) memory.
export function topTenTyped(scores: number[]): number[] {
  const a = Float64Array.from(scores).sort();
  return Array.from(a.subarray(Math.max(0, a.length - 10))).reverse();
}

// Quickselect (Hoare, 1961): split a copy around a random pivot, larger values to the front,
// and keep only the side that holds position k - 1, until the k largest are at the front.
// O(n) expected time, O(n^2) in the worst case; O(n) memory for the copy.
export function topKQuickselect(scores: number[], k = 10): number[] {
  const a = scores.slice();
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const pivot = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let i = lo, j = hi;
    while (i <= j) {
      while (a[i] > pivot) i++;
      while (a[j] < pivot) j--;
      if (i <= j) { const t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }
    }
    if (k - 1 <= j) hi = j;
    else if (k - 1 >= i) lo = i;
    else break;
  }
  return a.slice(0, k).sort((x, y) => y - x);
}

// The top k for a large k, by a full sort.
const topKSort = (scores: number[], k: number) => scores.toSorted((a, b) => b - a).slice(0, k);

if (process.argv[1] === import.meta.filename) {
  const s = makeScores(100_000);
  const expected = JSON.stringify(topTenSort(s));
  console.log("same top ten:", JSON.stringify(topTenTyped(s)) === expected, JSON.stringify(topKQuickselect(s)) === expected);
  console.log("k > n:", topKQuickselect([3, 1, 2], 5).join(" "), "|", topKHeap([3, 1, 2], 5).join(" "));
  const sizes = [250_000, 500_000, 1_000_000];
  bench("topTenTyped (Float64Array sort)", sizes, makeScores, topTenTyped);
  bench("topKQuickselect, k = 10", sizes, makeScores, topKQuickselect);
  // k grows with n: a tenth and a half of the scores.
  bench("topKHeap, k = n / 10", sizes, makeScores, (xs) => topKHeap(xs, xs.length / 10));
  bench("full sort, k = n / 10", sizes, makeScores, (xs) => topKSort(xs, xs.length / 10));
  bench("topKHeap, k = n / 2", sizes, makeScores, (xs) => topKHeap(xs, xs.length / 2));
  bench("full sort, k = n / 2", sizes, makeScores, (xs) => topKSort(xs, xs.length / 2));
}
