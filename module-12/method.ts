// The method on problem B, a run of minutes that adds up to a total: node method.ts
import assert from "node:assert/strict";
import { bench } from "./bench.ts";
import { hasRunWithTotal } from "./opening.ts";

// The slow solution: try every start, and add minutes until the sum reaches or passes the total.
// O(n^2) time in the worst case (a start can add up to n minutes), O(1) memory.
export function hasRunSlow(counts: number[], total: number): boolean {
  for (let start = 0; start < counts.length; start++) {
    let sum = 0;
    for (let end = start; end < counts.length && sum < total; end++) {
      sum += counts[end];
      if (sum === total) return true;
    }
  }
  return false;
}

// Even counts from 2 to 200, and an odd total near half their sum: no run matches, so both
// versions do all their work.
function makeMinutes(n: number): { counts: number[]; total: number } {
  const counts = Array.from({ length: n }, () => 2 * (1 + Math.floor(Math.random() * 100)));
  const sum = counts.reduce((s, c) => s + c, 0);
  return { counts, total: 2 * Math.floor(sum / 4) + 1 };
}

let sink = 0; // keeps every result, so no run can be skipped as unused

if (process.argv[1] === import.meta.filename) {
  for (let t = 0; t < 1000; t++) {
    const counts = Array.from({ length: Math.floor(Math.random() * 30) }, () => 1 + Math.floor(Math.random() * 9));
    const total = Math.floor(Math.random() * 60);
    assert.equal(hasRunSlow(counts, total), hasRunWithTotal(counts, total));
  }
  console.log("hasRunSlow and hasRunWithTotal agree on 1,000 random lists: true");

  const sizes = [10_000, 20_000, 40_000];
  bench("hasRunSlow", sizes, makeMinutes, ({ counts, total }) => (sink += +hasRunSlow(counts, total)));
  bench("hasRunWithTotal", sizes, makeMinutes, ({ counts, total }) => (sink += +hasRunWithTotal(counts, total)));
  bench("hasRunWithTotal, larger", [1_000_000, 2_000_000, 4_000_000], makeMinutes, ({ counts, total }) => (sink += +hasRunWithTotal(counts, total)));
  if (sink !== 0) console.log(sink);
}
