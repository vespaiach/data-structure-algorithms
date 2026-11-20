import { test } from "node:test";
import assert from "node:assert/strict";
import { widestSpacing } from "./widest-spacing.ts";

// Every way to choose k slots, and the best smallest gap: correct, O(C(n, k) * k).
function bruteForce(slots: number[], k: number): number {
  const s = slots.toSorted((a, b) => a - b);
  let best = 0;
  const chosen: number[] = [];
  const explore = (start: number): void => {
    if (chosen.length === k) {
      let gap = Infinity;
      for (let i = 1; i < k; i++) gap = Math.min(gap, chosen[i] - chosen[i - 1]);
      best = Math.max(best, gap);
      return;
    }
    for (let i = start; i < s.length; i++) {
      chosen.push(s[i]);
      explore(i + 1);
      chosen.pop();
    }
  };
  explore(0);
  return best;
}

test("three replicas in five slots", () => {
  assert.equal(widestSpacing([1, 2, 4, 8, 9], 3), 3); // 1, 4, 8 (or 1, 4, 9)
});

test("slots in any order", () => {
  assert.equal(widestSpacing([9, 1, 8, 4, 2], 3), 3);
});

test("two replicas take the ends; one per slot takes the smallest gap", () => {
  assert.equal(widestSpacing([5, 100, 40, 0], 2), 100);
  assert.equal(widestSpacing([0, 10, 13, 30], 4), 3);
});

test("positions up to 10^9", () => {
  assert.equal(widestSpacing([999_999_997, 999_999_999, 1_000_000_000], 3), 1);
  assert.equal(widestSpacing([0, 999_000_000, 1_000_000_000], 3), 1_000_000);
});

test("matches trying every choice on 300 random rows", () => {
  for (let t = 0; t < 300; t++) {
    const set = new Set<number>();
    const n = 2 + Math.floor(Math.random() * 9);
    while (set.size < n) set.add(Math.floor(Math.random() * 60));
    const slots = [...set];
    const k = 2 + Math.floor(Math.random() * (n - 1));
    assert.equal(widestSpacing(slots, k), bruteForce(slots, k), JSON.stringify({ slots, k }));
  }
});

test("50,000 slots and 20 replicas in under 100 ms", () => {
  // Slots 7 apart from 0, in a random order: 20 replicas fit 18,417 apart (2,631 steps of 7).
  const slots = Array.from({ length: 50_000 }, (_, i) => 7 * i).sort(() => Math.random() - 0.5);
  const start = performance.now();
  const got = widestSpacing(slots, 20);
  const ms = performance.now() - start;
  assert.equal(got, 18_417);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
