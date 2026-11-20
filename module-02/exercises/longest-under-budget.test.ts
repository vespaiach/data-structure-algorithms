import { test } from "node:test";
import assert from "node:assert/strict";
import { longestUnderBudget } from "./longest-under-budget.ts";

test("finds the longest run", () => {
  assert.equal(longestUnderBudget([200, 100, 300, 50, 50, 400, 100], 500), 4);
});

test("everything fits, nothing fits, empty", () => {
  assert.equal(longestUnderBudget([1, 2, 3], 100), 3);
  assert.equal(longestUnderBudget([600, 700], 500), 0);
  assert.equal(longestUnderBudget([], 10), 0);
});

test("zero-byte requests and an exact fit", () => {
  assert.equal(longestUnderBudget([0, 0, 5, 0], 5), 4);
  assert.equal(longestUnderBudget([5, 6], 5), 1);
});

test("agrees with checking every run", () => {
  for (let round = 0; round < 100; round++) {
    const sizes = Array.from({ length: 40 }, () => Math.floor(Math.random() * 100));
    const budget = Math.floor(Math.random() * 400);
    let best = 0;
    for (let i = 0; i < sizes.length; i++) {
      let total = 0;
      for (let j = i; j < sizes.length; j++) {
        total += sizes[j];
        if (total <= budget) best = Math.max(best, j - i + 1);
      }
    }
    assert.equal(longestUnderBudget(sizes, budget), best);
  }
});
