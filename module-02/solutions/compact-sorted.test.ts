import { test } from "node:test";
import assert from "node:assert/strict";
import { compactSorted } from "./compact-sorted.ts";

test("removes repeats in place", () => {
  const ids = [1, 1, 2, 3, 3, 3, 7];
  assert.equal(compactSorted(ids), 4);
  assert.deepEqual(ids, [1, 2, 3, 7]);
});

test("no repeats, all repeats, empty", () => {
  const a = [1, 2, 3];
  assert.equal(compactSorted(a), 3);
  assert.deepEqual(a, [1, 2, 3]);
  const b = [4, 4, 4];
  assert.equal(compactSorted(b), 1);
  assert.deepEqual(b, [4]);
  const c: number[] = [];
  assert.equal(compactSorted(c), 0);
  assert.deepEqual(c, []);
});

test("one million IDs take under 200 ms", () => {
  const ids = Array.from({ length: 1_000_000 }, (_, i) => Math.floor(i / 2));
  const start = performance.now();
  assert.equal(compactSorted(ids), 500_000);
  const ms = performance.now() - start;
  assert.ok(ms < 200, `took ${ms.toFixed(0)} ms`);
});
