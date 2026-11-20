// Where exponential search stops being practical: count-only runs, no output kept: node limits.ts
import assert from "node:assert/strict";
import { bench } from "./bench.ts";

// Visits all 2^n subsets. O(2^n) time, O(n) memory.
function countSubsets(n: number): number {
  let count = 0;
  function explore(start: number): void {
    count++;
    for (let i = start; i < n; i++) explore(i + 1);
  }
  explore(0);
  return count;
}

// Visits all n! orderings (about e * n! nodes). O(n * e * n!) time: each node scans n flags.
function countOrderings(n: number): number {
  let count = 0;
  const used = new Array<boolean>(n).fill(false);
  function explore(depth: number): void {
    if (depth === n) {
      count++;
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      explore(depth + 1);
      used[i] = false;
    }
  }
  explore(0);
  return count;
}

assert.equal(countSubsets(20), 2 ** 20);
assert.equal(countOrderings(8), 40_320);
bench("countSubsets (n items)", [20, 22, 24, 26], (n) => n, countSubsets, 3);
bench("countOrderings (n items)", [8, 9, 10], (n) => n, countOrderings, 3);
