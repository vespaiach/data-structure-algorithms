// A memo in one line with Map.prototype.getOrInsertComputed (ES2026, Node.js 26): node memo-insert.ts
import assert from "node:assert/strict";
import { waysMemo } from "./opening-fast.ts";

// The callback runs only when n is not in the Map, and its result is stored before it's returned.
// The check is "is the key there", not "is the value truthy", so a stored 0 counts as stored.
export function waysInsert(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return 1;
  return memo.getOrInsertComputed(n, () => waysInsert(n - 1, memo) + waysInsert(n - 2, memo));
}

// The steps-of-4-or-6 count from mistakes.ts: every odd n has 0 ways.
function waysFourSix(n: number): { ways: number; calls: number } {
  const memo = new Map<number, number>();
  let calls = 0;
  function ways(k: number): number {
    calls++;
    if (k === 0) return 1;
    if (k < 0) return 0;
    return memo.getOrInsertComputed(k, () => ways(k - 4) + ways(k - 6));
  }
  return { ways: ways(n), calls };
}

if (process.argv[1] === import.meta.filename) {
  for (let n = 0; n <= 70; n++) assert.equal(waysInsert(n), waysMemo(n));
  console.log("waysInsert(40):", waysInsert(40));
  console.log("steps of 4 or 6, n = 101:", waysFourSix(101));
}
