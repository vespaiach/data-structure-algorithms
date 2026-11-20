import { test } from "node:test";
import assert from "node:assert/strict";
import { longestChain } from "./longest-chain.ts";

// Walk up from everyone and count: correct, O(n * h).
function walkUp(managerOf: number[]): number {
  let most = 0;
  for (let e = 0; e < managerOf.length; e++) {
    let length = 1;
    for (let m = managerOf[e]; m !== -1; m = managerOf[m]) length++;
    most = Math.max(most, length);
  }
  return most;
}

// A random order of 0..n-1, used to give employees numbers that don't follow the chart.
function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// n employees: each one after the first reports to a random earlier one, or to nobody (1 in 10).
function randomChart(n: number): number[] {
  const id = shuffled(n);
  const managerOf = new Array<number>(n);
  for (let k = 0; k < n; k++)
    managerOf[id[k]] = k === 0 || Math.random() < 0.1 ? -1 : id[Math.floor(Math.random() * k)];
  return managerOf;
}

// One chain of n people, numbered in a random order.
function chain(n: number): number[] {
  const id = shuffled(n);
  const managerOf = new Array<number>(n);
  for (let k = 0; k < n; k++) managerOf[id[k]] = k === 0 ? -1 : id[k - 1];
  return managerOf;
}

test("a small chart", () => {
  // 0 runs the company; 1 and 2 report to 0; 3 reports to 1; 4 reports to 3.
  assert.equal(longestChain([-1, 0, 0, 1, 3]), 4); // 0, 1, 3, 4
});

test("a manager with a larger number than their report", () => {
  assert.equal(longestChain([2, 0, -1]), 3); // 2, 0, 1
});

test("nobody, one person, and two separate charts", () => {
  assert.equal(longestChain([]), 0);
  assert.equal(longestChain([-1]), 1);
  assert.equal(longestChain([-1, -1, 1, 2, 0]), 3); // 1, 2, 3 is longer than 0, 4
});

test("everyone reports to one person", () => {
  const managerOf = Array.from({ length: 200_000 }, (_, i) => (i === 0 ? -1 : 0));
  assert.equal(longestChain(managerOf), 2);
});

test("matches walking up from everyone on 300 random charts", () => {
  for (let t = 0; t < 300; t++) {
    const managerOf = randomChart(1 + Math.floor(Math.random() * 40));
    assert.equal(longestChain(managerOf), walkUp(managerOf), JSON.stringify(managerOf));
  }
});

test("one chain of 30,000 people in under 100 ms (too deep for recursion)", () => {
  const managerOf = chain(30_000);
  const start = performance.now();
  const got = longestChain(managerOf);
  const ms = performance.now() - start;
  assert.equal(got, 30_000);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
