import { test } from "node:test";
import assert from "node:assert/strict";
import { jobOrder, type Job } from "./job-order.ts";

const job = (id: string, arrive: number, length: number): Job => ({ id, arrive, length });

test("the shortest waiting job goes next, and the worker waits when nothing has arrived", () => {
  // a runs 0 to 5; then c (1 minute) before b (2 minutes); d arrives at 10, after the worker is free
  assert.deepEqual(jobOrder([job("a", 0, 5), job("b", 1, 2), job("c", 2, 1), job("d", 10, 1)]), ["a", "c", "b", "d"]);
  assert.deepEqual(jobOrder([job("late", 50, 3)]), ["late"]);
});

test("ties: earlier arrival first, then the smaller id", () => {
  assert.deepEqual(jobOrder([job("x", 0, 9), job("c", 2, 4), job("b", 1, 4), job("a", 2, 4)]), ["x", "b", "a", "c"]);
});

test("no jobs, and the input is not changed", () => {
  assert.deepEqual(jobOrder([]), []);
  const jobs = [job("b", 3, 1), job("a", 0, 1)];
  jobOrder(jobs);
  assert.deepEqual(jobs.map((j) => j.id), ["b", "a"]);
});

test("matches a step-by-step simulation on random jobs", () => {
  for (let trial = 0; trial < 50; trial++) {
    const jobs = Array.from({ length: 1 + Math.floor(Math.random() * 40) }, (_, i) =>
      job(`j${i}`, Math.floor(Math.random() * 60), 1 + Math.floor(Math.random() * 5)));
    // Minute by minute: when the worker is free, pick the best job that has arrived.
    const left = jobs.slice();
    const expected: string[] = [];
    let busyUntil = 0;
    for (let t = 0; left.length > 0; t++) {
      if (t < busyUntil) continue;
      const ready = left.filter((j) => j.arrive <= t);
      if (ready.length === 0) continue;
      ready.sort((a, b) => a.length - b.length || a.arrive - b.arrive || (a.id < b.id ? -1 : 1));
      left.splice(left.indexOf(ready[0]), 1);
      expected.push(ready[0].id);
      busyUntil = t + ready[0].length;
    }
    assert.deepEqual(jobOrder(jobs), expected);
  }
});

test("30,000 jobs that arrive together in under 300 ms", () => {
  const jobs = Array.from({ length: 30_000 }, (_, i) => job(`j${i}`, Math.floor(Math.random() * 10), 1 + Math.floor(Math.random() * 1_000)));
  const start = performance.now();
  const order = jobOrder(jobs);
  const ms = performance.now() - start;
  assert.equal(new Set(order).size, jobs.length);
  assert.ok(ms < 300, `took ${Math.round(ms)} ms`);
});
