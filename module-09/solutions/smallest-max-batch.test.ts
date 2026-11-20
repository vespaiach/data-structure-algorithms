import { test } from "node:test";
import assert from "node:assert/strict";
import { smallestMaxBatch } from "./smallest-max-batch.ts";

test("small examples", () => {
  assert.equal(smallestMaxBatch([7, 2, 5, 10, 8], 2), 18); // [7,2,5] [10,8]
  assert.equal(smallestMaxBatch([1, 2, 3, 4, 5], 1), 15);
  assert.equal(smallestMaxBatch([1, 2, 3, 4, 5], 5), 5);
  assert.equal(smallestMaxBatch([1, 2, 3, 4, 5], 9), 5); // more batches than files
});

test("one file, no files", () => {
  assert.equal(smallestMaxBatch([42], 3), 42);
  assert.equal(smallestMaxBatch([], 3), 0);
});

// Brute force: try every way to cut the list into at most k runs.
function brute(files: number[], k: number): number {
  const go = (start: number, left: number): number => {
    if (start === files.length) return 0;
    if (left === 0) return Infinity;
    let best = Infinity, sum = 0;
    for (let end = start; end < files.length; end++) {
      sum += files[end];
      best = Math.min(best, Math.max(sum, go(end + 1, left - 1)));
    }
    return best;
  };
  return go(0, k);
}

test("matches brute force on random small inputs", () => {
  for (let t = 0; t < 300; t++) {
    const files = Array.from({ length: 1 + Math.floor(Math.random() * 8) }, () => 1 + Math.floor(Math.random() * 20));
    const k = 1 + Math.floor(Math.random() * 4);
    assert.equal(smallestMaxBatch(files, k), brute(files, k), JSON.stringify({ files, k }));
  }
});

test("sizes above 2^32 stay exact", () => {
  // [3e12] and [1e12, 1e12, 1e12]: a midpoint like (lo + hi) >>> 1 would wrap here.
  assert.equal(smallestMaxBatch([3e12, 1e12, 1e12, 1e12], 2), 3e12);
});

test("1,000 files in 4 batches in under 50 ms", () => {
  const files = Array.from({ length: 1_000 }, () => 1 + Math.floor(Math.random() * 1_000));
  const start = performance.now();
  const answer = smallestMaxBatch(files, 4);
  const ms = performance.now() - start;
  assert.ok(answer > 0);
  assert.ok(ms < 50, `took ${Math.round(ms)} ms`);
});
