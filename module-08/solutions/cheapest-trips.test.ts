import { test } from "node:test";
import assert from "node:assert/strict";
import { cheapestTrips } from "./cheapest-trips.ts";

const sorted = (n: number) => Array.from({ length: n }, () => 50 + Math.floor(Math.random() * 950)).sort((a, b) => a - b);
const allPairs = (out: number[], back: number[], k: number) =>
  out.flatMap((a) => back.map((b) => a + b)).sort((x, y) => x - y).slice(0, k);

test("the three cheapest trips", () => {
  // trips: 100+40, 100+70, 120+40, 120+70, 300+40, 300+70
  assert.deepEqual(cheapestTrips([100, 120, 300], [40, 70], 3), [140, 160, 170]);
});

test("k = 0, k larger than the number of trips, an empty list, equal prices", () => {
  assert.deepEqual(cheapestTrips([1, 2], [3], 0), []);
  assert.deepEqual(cheapestTrips([1, 2], [3, 4], 10), [4, 5, 5, 6]);
  assert.deepEqual(cheapestTrips([], [3, 4], 2), []);
  assert.deepEqual(cheapestTrips([5, 6], [], 2), []);
  assert.deepEqual(cheapestTrips([10, 10], [10, 10], 3), [20, 20, 20]);
});

test("matches pricing every pair on random lists", () => {
  for (let trial = 0; trial < 50; trial++) {
    const out = sorted(Math.floor(Math.random() * 30)), back = sorted(Math.floor(Math.random() * 30));
    const k = Math.floor(Math.random() * 100);
    assert.deepEqual(cheapestTrips(out, back, k), allPairs(out, back, k));
  }
});

test("the 100 cheapest of 3,000 x 3,000 trips in under 100 ms", () => {
  const out = sorted(3_000), back = sorted(3_000);
  const start = performance.now();
  const prices = cheapestTrips(out, back, 100);
  const ms = performance.now() - start;
  assert.equal(prices.length, 100);
  assert.equal(prices[0], out[0] + back[0]);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
