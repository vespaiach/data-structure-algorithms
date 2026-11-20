import { test } from "node:test";
import assert from "node:assert/strict";
import { fewestChecks } from "./fewest-checks.ts";

test("three jobs, two checks", () => {
  // A check at 4 covers [1, 4] and [3, 6]; [7, 9] needs another.
  assert.equal(fewestChecks([[3, 6], [1, 4], [7, 9]]), 2);
});

test("both ends count: windows that share one minute need one check", () => {
  assert.equal(fewestChecks([[1, 3], [3, 5]]), 1);
  assert.equal(fewestChecks([[1, 3], [4, 5]]), 2);
});

test("no jobs, one job, a window of one minute, nested windows", () => {
  assert.equal(fewestChecks([]), 0);
  assert.equal(fewestChecks([[5, 5]]), 1);
  assert.equal(fewestChecks([[1, 10], [4, 5], [2, 3]]), 2);
});

// Try every set of minutes from 0 to 11 and keep the smallest that covers every window.
function brute(windows: [number, number][]): number {
  let best = Infinity;
  for (let mask = 0; mask < 1 << 12; mask++) {
    const covers = windows.every(([s, e]) => {
      for (let m = s; m <= e; m++) if (mask & (1 << m)) return true;
      return false;
    });
    if (covers) {
      let size = 0;
      for (let m = mask; m > 0; m &= m - 1) size++;
      best = Math.min(best, size);
    }
  }
  return best;
}

test("matches trying every set of minutes on random small days", () => {
  for (let trial = 0; trial < 100; trial++) {
    const windows = Array.from({ length: Math.floor(Math.random() * 8) }, (): [number, number] => {
      const s = Math.floor(Math.random() * 10);
      return [s, Math.min(11, s + Math.floor(Math.random() * 4))];
    });
    assert.equal(fewestChecks(windows), brute(windows), JSON.stringify(windows));
  }
});

test("20,000 jobs in under 100 ms", () => {
  const windows = Array.from({ length: 20_000 }, (): [number, number] => {
    const s = Math.floor(Math.random() * 200_000);
    return [s, s + Math.floor(Math.random() * 60)];
  });
  const start = performance.now();
  const checks = fewestChecks(windows);
  const ms = performance.now() - start;
  assert.ok(checks > 0);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
