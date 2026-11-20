import { test } from "node:test";
import assert from "node:assert/strict";
import { busiestSlow, busiestWindow, busiestByPrefix, SECONDS } from "./busiest.ts";

const all = [busiestSlow, busiestWindow, busiestByPrefix];

test("the example log", () => {
  const times = [5, 30, 64, 70, 100, 125, 128, 129];
  for (const f of all) assert.deepEqual(f(times), { start: 70, count: 5 }, f.name);
});

test("empty log", () => {
  for (const f of all) assert.deepEqual(f([]), { start: 0, count: 0 }, f.name);
});

test("a request exactly 60 seconds later is in the next minute", () => {
  for (const f of all) assert.deepEqual(f([0, 60]), { start: 0, count: 1 }, f.name);
});

test("requests at the end of the day", () => {
  for (const f of all) assert.deepEqual(f([SECONDS - 2, SECONDS - 1, SECONDS - 1]), { start: SECONDS - 2, count: 3 }, f.name);
});

test("all three agree on random logs", () => {
  for (let round = 0; round < 50; round++) {
    const times = Array.from({ length: 300 }, () => Math.floor(Math.random() * 3_000)).sort((a, b) => a - b);
    const expected = busiestSlow(times);
    assert.deepEqual(busiestWindow(times), expected);
    assert.deepEqual(busiestByPrefix(times), expected);
  }
});
