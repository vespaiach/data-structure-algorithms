// The same count, solving each number of steps once: node opening-fast.ts
import assert from "node:assert/strict";
import { bench } from "./bench.ts";
import { waysSlow } from "./opening-slow.ts";

// Top down: the slow recursion plus a Map from n to its answer.
// Each n from 2 to n is computed once: O(n) time, O(n) memory for the Map and the call stack.
export function waysMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return 1;
  const known = memo.get(n);
  if (known !== undefined) return known;
  const result = waysMemo(n - 1, memo) + waysMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Bottom up: fill a table from the smallest n. O(n) time, O(n) memory, no recursion.
export function waysTable(n: number): number {
  const table = new Array<number>(n + 1);
  table[0] = 1;
  table[1] = 1;
  for (let i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2];
  return table[n];
}

// Bottom up, keeping only the last two answers. O(n) time, O(1) memory.
export function waysTwoVars(n: number): number {
  let before = 1; // ways(i - 2)
  let last = 1; // ways(i - 1)
  for (let i = 2; i <= n; i++) [before, last] = [last, before + last];
  return last;
}

let sink = 0; // keeps every result, so no run can be skipped as unused

if (process.argv[1] === import.meta.filename) {
  for (let n = 0; n <= 25; n++) assert.equal(waysMemo(n), waysSlow(n));
  for (let n = 0; n <= 1500; n++) {
    assert.equal(waysTable(n), waysMemo(n));
    assert.equal(waysTwoVars(n), waysMemo(n));
  }
  console.log("ways(40):", waysMemo(40), waysTable(40), waysTwoVars(40));
  console.log("ways(60):", waysTwoVars(60));

  const steps = [30, 35, 40];
  bench("waysMemo, same sizes as waysSlow", steps, (n) => n, (n) => (sink += waysMemo(n)));
  bench("waysMemo", [1_000, 2_000, 4_000], (n) => n, (n) => (sink += waysMemo(n)));
  // Past 1,476 steps the count is Infinity as a Number, but each loop still does n additions.
  const big = [100_000, 1_000_000, 10_000_000];
  bench("waysTable", big, (n) => n, (n) => (sink += waysTable(n)));
  bench("waysTwoVars", big, (n) => n, (n) => (sink += waysTwoVars(n)));
  if (sink === 0) console.log(sink);
}
