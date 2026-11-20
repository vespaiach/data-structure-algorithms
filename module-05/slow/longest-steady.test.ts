import { test } from "node:test";
import assert from "node:assert/strict";
import { longestSteady } from "./longest-steady.ts";

test("example", () => {
  // 60, 62, 61, 64 differ by at most 4; adding 70 or 59 breaks it.
  assert.equal(longestSteady([70, 60, 62, 61, 64, 59, 58], 4), 4);
});
test("limit 0 means equal values", () => {
  assert.equal(longestSteady([3, 3, 1, 1, 1, 2], 0), 3);
});
test("empty and one sample", () => {
  assert.equal(longestSteady([], 5), 0);
  assert.equal(longestSteady([42], 0), 1);
});
test("matches the slow version on random input", () => {
  for (const limit of [0, 3, 10, 50]) {
    const s = Array.from({ length: 300 }, () => Math.floor(Math.random() * 40));
    let slow = 0;
    for (let i = 0; i < s.length; i++) {
      let max = s[i];
      let min = s[i];
      for (let j = i; j < s.length; j++) {
        max = Math.max(max, s[j]);
        min = Math.min(min, s[j]);
        if (max - min > limit) break;
        slow = Math.max(slow, j - i + 1);
      }
    }
    assert.equal(longestSteady(s, limit), slow, `limit ${limit}`);
  }
});
test("50,000 samples in one long steady run take under 200 ms", () => {
  const s = Array.from({ length: 50_000 }, () => Math.floor(Math.random() * 10));
  const start = performance.now();
  const best = longestSteady(s, 10);
  const ms = performance.now() - start;
  assert.equal(best, 50_000);
  assert.ok(ms < 200, `took ${Math.round(ms)} ms`);
});
