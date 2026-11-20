import { test } from "node:test";
import assert from "node:assert/strict";
import { lastFinish } from "./last-finish.ts";

// Scan every runner for each job: correct, O(n * k).
function simulate(durations: number[], runners: number): number {
  const freeAt = new Array<number>(runners).fill(0);
  for (const d of durations) {
    const first = freeAt.indexOf(Math.min(...freeAt));
    freeAt[first] += d;
  }
  return Math.max(0, ...freeAt);
}

test("three jobs on two runners", () => {
  // 0-5 on runner A, 0-2 on runner B, then the third job on B from 2 to 6.
  assert.equal(lastFinish([5, 2, 4], 2), 6);
});

test("the last job to start is not the last to finish", () => {
  assert.equal(lastFinish([10, 1, 1, 1], 2), 10);
});

test("no jobs, more runners than jobs, one runner", () => {
  assert.equal(lastFinish([], 3), 0);
  assert.equal(lastFinish([4, 9, 2], 10), 9);
  assert.equal(lastFinish([4, 9, 2], 1), 15);
  assert.equal(lastFinish([0, 0], 1), 0);
});

test("matches scanning the runners on 300 random cases", () => {
  for (let t = 0; t < 300; t++) {
    const durations = Array.from({ length: Math.floor(Math.random() * 30) }, () => Math.floor(Math.random() * 50));
    const runners = 1 + Math.floor(Math.random() * 8);
    assert.equal(lastFinish(durations, runners), simulate(durations, runners), JSON.stringify({ durations, runners }));
  }
});

test("200,000 jobs on 10,000 runners in under 100 ms", () => {
  // Every job takes 10 seconds, so the jobs go out in 20 waves of 10,000.
  const durations = new Array<number>(200_000).fill(10);
  const start = performance.now();
  const got = lastFinish(durations, 10_000);
  const ms = performance.now() - start;
  assert.equal(got, 200);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
