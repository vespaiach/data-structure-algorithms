import { test } from "node:test";
import assert from "node:assert/strict";
import { daysAtMost } from "./days-at-most.ts";

test("example", () => {
  assert.deepEqual(daysAtMost([100, 80, 60, 70, 60, 75, 85]), [1, 1, 1, 2, 1, 4, 6]);
});
test("equal counts are at most, so they extend the run", () => {
  assert.deepEqual(daysAtMost([5, 5, 5]), [1, 2, 3]);
});
test("empty, rising and falling", () => {
  assert.deepEqual(daysAtMost([]), []);
  assert.deepEqual(daysAtMost([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(daysAtMost([3, 2, 1]), [1, 1, 1]);
});
test("matches the slow version on random input", () => {
  const counts = Array.from({ length: 2000 }, () => Math.floor(Math.random() * 20));
  const slow = counts.map((c, i) => {
    let j = i;
    while (j >= 0 && counts[j] <= c) j--;
    return i - j;
  });
  assert.deepEqual(daysAtMost(counts), slow);
});
test("50,000 rising counts take under 100 ms", () => {
  const counts = Array.from({ length: 50_000 }, (_, i) => i);
  const start = performance.now();
  const out = daysAtMost(counts);
  const ms = performance.now() - start;
  assert.equal(out[49_999], 50_000);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
