import { test } from "node:test";
import assert from "node:assert/strict";
import { bestWeek } from "./best-week.ts";

test("finds the best window", () => {
  assert.deepEqual(bestWeek([4, 2, 7, 1, 8, 3, 0], 3), { start: 2, total: 16 });
});

test("window as long as the list, window of one", () => {
  assert.deepEqual(bestWeek([1, 2, 3], 3), { start: 0, total: 6 });
  assert.deepEqual(bestWeek([5, 9, 2], 1), { start: 1, total: 9 });
});

test("ties go to the earliest start; negative days count", () => {
  assert.deepEqual(bestWeek([3, 3, 3, 3], 2), { start: 0, total: 6 });
  assert.deepEqual(bestWeek([-5, -1, -3], 1), { start: 1, total: -1 });
});

test("rejects a bad k", () => {
  assert.throws(() => bestWeek([1, 2], 0), RangeError);
  assert.throws(() => bestWeek([1, 2], 3), RangeError);
});

test("agrees with summing every window", () => {
  for (let round = 0; round < 100; round++) {
    const sales = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) - 20);
    const k = 1 + Math.floor(Math.random() * 30);
    let best = { start: 0, total: -Infinity };
    for (let s = 0; s + k <= sales.length; s++) {
      const total = sales.slice(s, s + k).reduce((a, b) => a + b, 0);
      if (total > best.total) best = { start: s, total };
    }
    assert.deepEqual(bestWeek(sales, k), best);
  }
});
