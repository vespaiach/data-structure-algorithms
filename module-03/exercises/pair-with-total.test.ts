import { test } from "node:test";
import assert from "node:assert/strict";
import { pairWithTotal } from "./pair-with-total.ts";

test("finds a pair in an unsorted list", () => {
  const amounts = [40, 15, 70, 25, 60];
  const pair = pairWithTotal(amounts, 85);
  assert.ok(pair);
  assert.equal(amounts[pair[0]] + amounts[pair[1]], 85);
  assert.ok(pair[0] < pair[1]);
});

test("does not use one payment twice", () => {
  assert.equal(pairWithTotal([5, 9], 10), null);
  assert.deepEqual(pairWithTotal([5, 1, 5], 10), [0, 2]);
});

test("no pair, empty list", () => {
  assert.equal(pairWithTotal([1, 2, 4], 100), null);
  assert.equal(pairWithTotal([], 0), null);
});

test("200,000 amounts with no pair take under 200 ms", () => {
  const amounts = Array.from({ length: 200_000 }, (_, i) => i * 2);
  const start = performance.now();
  assert.equal(pairWithTotal(amounts, 1), null);
  const ms = performance.now() - start;
  assert.ok(ms < 200, `took ${ms.toFixed(0)} ms`);
});
