import { test } from "node:test";
import assert from "node:assert/strict";
import { longestStreak } from "./longest-streak.ts";

test("finds the longest run in unsorted days", () => {
  assert.equal(longestStreak([10, 4, 12, 11, 5, 1, 13]), 4);
});

test("repeated days count once", () => {
  assert.equal(longestStreak([3, 3, 4, 4, 5]), 3);
});

test("no days, one day, no neighbours", () => {
  assert.equal(longestStreak([]), 0);
  assert.equal(longestStreak([42]), 1);
  assert.equal(longestStreak([1, 3, 5]), 1);
});

test("one long run of 300,000 shuffled days takes under 300 ms", () => {
  const days = Array.from({ length: 300_000 }, (_, i) => i);
  for (let i = days.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [days[i], days[j]] = [days[j], days[i]];
  }
  const start = performance.now();
  assert.equal(longestStreak(days), 300_000);
  const ms = performance.now() - start;
  assert.ok(ms < 300, `took ${ms.toFixed(0)} ms`);
});
