// How many calls the slow version makes, and how often it solves the same n: node call-count.ts
import assert from "node:assert/strict";
import { waysSlow } from "./opening-slow.ts";
import { waysTwoVars } from "./opening-fast.ts";

// waysSlow and waysMemo with a counter added. The answers are checked against the real functions.
let calls = 0;
const solved = new Map<number, number>(); // n -> how many times it was solved
function waysCounted(n: number): number {
  calls++;
  solved.set(n, (solved.get(n) ?? 0) + 1);
  if (n <= 1) return 1;
  return waysCounted(n - 1) + waysCounted(n - 2);
}
function waysMemoCounted(n: number, memo: Map<number, number>): number {
  calls++;
  if (n <= 1) return 1;
  const known = memo.get(n);
  if (known !== undefined) return known;
  const result = waysMemoCounted(n - 1, memo) + waysMemoCounted(n - 2, memo);
  memo.set(n, result);
  return result;
}

const fmt = (x: number) => x.toLocaleString("en-US");
console.log("n    ways(n)        calls (slow)   2 * ways(n) - 1   calls (memo)");
for (const n of [5, 10, 20, 30, 35, 40]) {
  calls = 0;
  const w = waysCounted(n);
  if (n <= 35) assert.equal(w, waysSlow(n));
  const slowCalls = calls;
  calls = 0;
  waysMemoCounted(n, new Map());
  console.log(`${String(n).padEnd(5)}${fmt(w).padEnd(15)}${fmt(slowCalls).padEnd(15)}${fmt(2 * w - 1).padEnd(18)}${fmt(calls)}`);
}

solved.clear();
waysCounted(30);
console.log("\nwaysSlow(30) solves n = 29 once, n = 20", fmt(solved.get(20)!), "times, n = 10", fmt(solved.get(10)!), "times, n = 2", fmt(solved.get(2)!), "times");

const phi = (1 + Math.sqrt(5)) / 2;
console.log(`\nphi = ${phi.toFixed(6)}, phi^5 = ${(phi ** 5).toFixed(2)}, phi^20 = ${fmt(Math.round(phi ** 20))}`);
console.log(`calls for n = 60: 2 * ways(60) - 1 = ${fmt(2 * waysTwoVars(60) - 1)}`);
