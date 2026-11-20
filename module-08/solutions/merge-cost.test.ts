import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeCost } from "./merge-cost.ts";

test("four files", () => {
  // 2 + 3 = 5, then 4 + 5 = 9, then 6 + 9 = 15: 5 + 9 + 15 = 29
  assert.equal(mergeCost([4, 3, 2, 6]), 29);
});

test("no file, one file, equal sizes, and the input is not changed", () => {
  assert.equal(mergeCost([]), 0);
  assert.equal(mergeCost([7]), 0);
  assert.equal(mergeCost([1, 1, 1, 1]), 8);
  const sizes = [5, 1, 3];
  mergeCost(sizes);
  assert.deepEqual(sizes, [5, 1, 3]);
});

test("matches merging by hand on random sizes", () => {
  for (let trial = 0; trial < 50; trial++) {
    const sizes = Array.from({ length: 1 + Math.floor(Math.random() * 30) }, () => 1 + Math.floor(Math.random() * 100));
    const files = sizes.slice();
    let total = 0;
    while (files.length > 1) {
      files.sort((a, b) => a - b);
      const merged = files[0] + files[1];
      files.splice(0, 2, merged);
      total += merged;
    }
    assert.equal(mergeCost(sizes), total);
  }
});

test("20,000 files in under 300 ms", () => {
  const sizes = Array.from({ length: 20_000 }, () => 1 + Math.floor(Math.random() * 1_000));
  const start = performance.now();
  const total = mergeCost(sizes);
  const ms = performance.now() - start;
  assert.ok(total > 0);
  assert.ok(ms < 300, `took ${Math.round(ms)} ms`);
});
