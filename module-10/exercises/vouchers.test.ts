import { test } from "node:test";
import assert from "node:assert/strict";
import { vouchersForTotal } from "./vouchers.ts";

const key = (xs: number[][]) => xs.map((s) => s.join(",")).sort().join(" ");

// Every subset, keep those that add up to target, drop repeats: correct but slow.
function bruteForce(values: number[], target: number): number[][] {
  const seen = new Map<string, number[]>();
  for (let mask = 0; mask < 2 ** values.length; mask++) {
    const pick = values.filter((_, i) => Math.floor(mask / 2 ** i) % 2 === 1).sort((a, b) => a - b);
    if (pick.reduce((s, v) => s + v, 0) === target) seen.set(pick.join(","), pick);
  }
  return [...seen.values()];
}

test("ways to pay 50", () => {
  assert.equal(key(vouchersForTotal([30, 10, 20, 40, 50, 5], 50)), key([[50], [10, 40], [20, 30]]));
});

test("equal amounts: each set once, in ascending order", () => {
  const out = vouchersForTotal([20, 10, 30, 10, 20], 40);
  assert.equal(key(out), key([[10, 30], [20, 20], [10, 10, 20]]));
  assert.equal(out.length, 3);
  assert.ok(out.every((s) => s.every((v, i) => i === 0 || s[i - 1] <= v)));
});

test("no way to reach the total, target 0, no vouchers", () => {
  assert.deepEqual(vouchersForTotal([20, 30], 25), []);
  assert.deepEqual(vouchersForTotal([5, 10], 0), [[]]);
  assert.deepEqual(vouchersForTotal([], 10), []);
  assert.deepEqual(vouchersForTotal([], 0), [[]]);
});

test("the input keeps its order", () => {
  const values = [30, 10, 20];
  vouchersForTotal(values, 30);
  assert.deepEqual(values, [30, 10, 20]);
});

test("matches a brute force on 200 random cases", () => {
  for (let t = 0; t < 200; t++) {
    const values = Array.from({ length: Math.floor(Math.random() * 11) }, () => 5 * (1 + Math.floor(Math.random() * 6)));
    const target = 5 * Math.floor(Math.random() * 13);
    assert.equal(key(vouchersForTotal(values, target)), key(bruteForce(values, target)), JSON.stringify({ values, target }));
  }
});

test("22 vouchers with many equal amounts, in under 100 ms", () => {
  const values = Array.from({ length: 22 }, () => 5 * (1 + Math.floor(Math.random() * 8)));
  const start = performance.now();
  const out = vouchersForTotal(values, 60);
  const ms = performance.now() - start;
  assert.equal(new Set(out.map((s) => s.join(","))).size, out.length);
  assert.ok(out.every((s) => s.reduce((a, b) => a + b, 0) === 60));
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
