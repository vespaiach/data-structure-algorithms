import { test } from "node:test";
import assert from "node:assert/strict";
import { type Booking, mostValue } from "./most-value.ts";

// Every subset of bookings, keep the best one with no overlaps: correct but O(2^n * n log n).
function bruteForce(bs: Booking[]): number {
  let best = 0;
  for (let mask = 0; mask < 2 ** bs.length; mask++) {
    const chosen = bs.filter((_, i) => Math.floor(mask / 2 ** i) % 2 === 1).sort((x, y) => x[0] - y[0]);
    if (chosen.every((b, i) => i === 0 || chosen[i - 1][1] <= b[0]))
      best = Math.max(best, chosen.reduce((sum, b) => sum + b[2], 0));
  }
  return best;
}

// n bookings in a day of 10,000 minutes, 1 to 60 minutes long, worth 1 to 100.
function makeBookings(n: number, day = 10_000): Booking[] {
  return Array.from({ length: n }, (): Booking => {
    const start = Math.floor(Math.random() * day);
    return [start, start + 1 + Math.floor(Math.random() * 60), 1 + Math.floor(Math.random() * 100)];
  });
}

test("one long booking worth more than the short ones it overlaps", () => {
  assert.equal(mostValue([[9, 17, 500], [9, 11, 100], [11, 13, 100], [13, 15, 100]]), 500);
});

test("the earliest end first (Module 9's rule) is wrong here", () => {
  assert.equal(mostValue([[9, 10, 10], [9, 12, 100], [10, 11, 10]]), 100);
});

test("bookings that touch fit together", () => {
  assert.equal(mostValue([[9, 10, 5], [10, 11, 7], [11, 12, 9]]), 21);
});

test("no bookings, one booking, and the input keeps its order", () => {
  assert.equal(mostValue([]), 0);
  assert.equal(mostValue([[3, 4, 8]]), 8);
  const bs: Booking[] = [[5, 9, 1], [1, 2, 3]];
  mostValue(bs);
  assert.deepEqual(bs, [[5, 9, 1], [1, 2, 3]]);
});

test("matches a brute force on 300 random days", () => {
  for (let t = 0; t < 300; t++) {
    const bs = makeBookings(Math.floor(Math.random() * 11), 100);
    assert.equal(mostValue(bs), bruteForce(bs), JSON.stringify(bs));
  }
});

test("40,000 bookings in under 100 ms", () => {
  const bs = makeBookings(40_000, 100);
  const start = performance.now();
  const got = mostValue(bs);
  const ms = performance.now() - start;
  assert.ok(got > 0);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
