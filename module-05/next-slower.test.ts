import { test } from "node:test";
import assert from "node:assert/strict";
import { nextSlower } from "./next-slower.ts";

test("example", () => {
  assert.deepEqual(nextSlower([120, 80, 95, 300, 90, 90, 150]), [3, 2, 3, -1, 6, 6, -1]);
});
test("equal times do not count as slower", () => {
  assert.deepEqual(nextSlower([50, 50, 50]), [-1, -1, -1]);
});
test("empty, increasing and decreasing", () => {
  assert.deepEqual(nextSlower([]), []);
  assert.deepEqual(nextSlower([1, 2, 3]), [1, 2, -1]);
  assert.deepEqual(nextSlower([3, 2, 1]), [-1, -1, -1]);
});
test("matches the slow version on random input", () => {
  // Times from 0 to 19 ms, so many requests take the same time.
  const ms = Array.from({ length: 2000 }, () => Math.floor(Math.random() * 20));
  const slow = ms.map((v, i) => {
    for (let j = i + 1; j < ms.length; j++) if (ms[j] > v) return j;
    return -1;
  });
  assert.deepEqual(nextSlower(ms), slow);
});
