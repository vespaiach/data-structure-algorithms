import { test } from "node:test";
import assert from "node:assert/strict";
import { largestBlock } from "./largest-block.ts";

// Every run of hours with its fewest cores: correct, O(n^2).
function everyRun(freeCores: number[]): number {
  let best = 0;
  for (let from = 0; from < freeCores.length; from++) {
    let fewest = Infinity;
    for (let to = from; to < freeCores.length; to++) {
      fewest = Math.min(fewest, freeCores[to]);
      best = Math.max(best, fewest * (to - from + 1));
    }
  }
  return best;
}

test("a day of free cores", () => {
  assert.equal(largestBlock([2, 1, 5, 6, 2, 3]), 10); // 5 cores in hours 2 and 3
  assert.equal(largestBlock([4, 2, 0, 3, 2, 5]), 6); // 2 cores in hours 3 to 5
});

test("equal hours, rising, falling", () => {
  assert.equal(largestBlock([3, 3, 3]), 9);
  assert.equal(largestBlock([1, 2, 3, 4, 5]), 9); // 3 cores for hours 2 to 4
  assert.equal(largestBlock([5, 4, 3, 2, 1]), 9);
});

test("no hours, one hour, no free cores", () => {
  assert.equal(largestBlock([]), 0);
  assert.equal(largestBlock([7]), 7);
  assert.equal(largestBlock([0, 0, 0]), 0);
});

test("matches trying every run on 300 random days", () => {
  for (let t = 0; t < 300; t++) {
    const freeCores = Array.from({ length: Math.floor(Math.random() * 40) }, () => Math.floor(Math.random() * 6));
    assert.equal(largestBlock(freeCores), everyRun(freeCores), JSON.stringify(freeCores));
  }
});

test("40,000 hours in under 100 ms", () => {
  // Cores rise by one each hour from 1 to 20,000, then fall again.
  const freeCores = Array.from({ length: 40_000 }, (_, h) => (h < 20_000 ? h + 1 : 40_000 - h));
  const start = performance.now();
  const got = largestBlock(freeCores);
  const ms = performance.now() - start;
  assert.equal(got, 10_000 * 20_002); // 10,000 cores for the 20,002 hours from 9,999 to 30,000
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
