// Opening problem: the ten highest of a million scores. The slow version: node opening-slow.ts
import { bench } from "./bench.ts";

// n random whole-number scores from 0 to 999,999.
export function makeScores(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 1_000_000));
}

// Sort a copy of every score, highest first, and keep the first ten.
// O(n log n) time, O(n) extra memory for the copy.
export function topTenSort(scores: number[]): number[] {
  return scores.toSorted((a, b) => b - a).slice(0, 10);
}

if (process.argv[1] === import.meta.filename) {
  const scores = [5, 100, 25, 1000, 9, 80, 300];
  console.log("top ten of", scores.join(" "), "->", topTenSort(scores).join(" "));
  bench("topTenSort", [250_000, 500_000, 1_000_000], makeScores, topTenSort);
}
