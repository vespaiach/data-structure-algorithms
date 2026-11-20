import { test } from "node:test";
import assert from "node:assert/strict";
import { rangeTotals } from "./range-totals.ts";

test("answers each query", () => {
  const sales = [5, 3, 8, 6, 2];
  assert.deepEqual(rangeTotals(sales, [[0, 5], [1, 3], [4, 5], [2, 2]]), [24, 11, 2, 0]);
});

test("no queries, no days", () => {
  assert.deepEqual(rangeTotals([1, 2], []), []);
  assert.deepEqual(rangeTotals([], [[0, 0]]), [0]);
});

test("100,000 days and 100,000 queries take under 200 ms", () => {
  const sales = Array.from({ length: 100_000 }, (_, d) => d % 7);
  const queries = Array.from({ length: 100_000 }, (_, i): [number, number] => [i % 1000, 100_000 - (i % 1000)]);
  const start = performance.now();
  const answers = rangeTotals(sales, queries);
  const ms = performance.now() - start;
  let expected = 0;
  for (const s of sales) expected += s;
  assert.equal(answers[0], expected);
  assert.ok(ms < 200, `took ${ms.toFixed(0)} ms`);
});
