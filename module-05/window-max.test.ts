import { test } from "node:test";
import assert from "node:assert/strict";
import { windowMax } from "./window-max.ts";

test("example", () => {
  assert.deepEqual(windowMax([30, 10, 50, 20, 20, 40, 10], 3), [50, 50, 50, 40, 40]);
});
test("k = 1 and k = length", () => {
  assert.deepEqual(windowMax([4, 2, 7], 1), [4, 2, 7]);
  assert.deepEqual(windowMax([4, 2, 7], 3), [7]);
});
test("k larger than the input gives no windows", () => {
  assert.deepEqual(windowMax([1, 2], 3), []);
});
test("k < 1 throws", () => {
  assert.throws(() => windowMax([1], 0), RangeError);
});
test("matches the slow version on random input", () => {
  const s = Array.from({ length: 2000 }, () => Math.floor(Math.random() * 100));
  for (const k of [1, 2, 5, 50, 2000]) {
    const slow: number[] = [];
    for (let i = 0; i + k <= s.length; i++) slow.push(Math.max(...s.slice(i, i + k)));
    assert.deepEqual(windowMax(s, k), slow, `k = ${k}`);
  }
});
