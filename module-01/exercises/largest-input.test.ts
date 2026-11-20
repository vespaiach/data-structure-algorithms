import { test } from "node:test";
import assert from "node:assert/strict";
import { costs, largestInput } from "./largest-input.ts";

test("limits for a budget of 100 million steps", () => {
  assert.equal(largestInput(costs["n"], 1e8), 100_000_000);
  assert.equal(largestInput(costs["n^2"], 1e8), 10_000);
  assert.equal(largestInput(costs["n^3"], 1e8), 464);
  assert.equal(largestInput(costs["2^n"], 1e8), 26);
});

test("n log n sits between n and n^2", () => {
  const n = largestInput(costs["n log n"], 1e8);
  assert.ok(n > 10_000 && n < 100_000_000);
  assert.ok(costs["n log n"](n) <= 1e8 && costs["n log n"](n + 1) > 1e8);
});

test("a budget smaller than one step", () => {
  assert.equal(largestInput(costs["n"], 0.5), 0);
});
