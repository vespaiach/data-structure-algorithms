// Tests for the module's code: node --test search.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { lowerBound, upperBound } from "./bounds.ts";
import { makeJob, smallestBatchSlow } from "./opening-slow.ts";
import { smallestBatchFast } from "./opening-fast.ts";
import { type Meeting, mostMeetings, mostMeetingsBrute } from "./meetings.ts";
import { countBetween, mergeBusy } from "./variations.ts";

test("bounds: empty, absent, all equal, before all, after all", () => {
  assert.equal(lowerBound([], 5), 0);
  assert.equal(upperBound([], 5), 0);
  assert.equal(lowerBound([1, 3, 5], 4), 2); // absent: where it would go
  assert.equal(upperBound([1, 3, 5], 4), 2);
  assert.equal(lowerBound([7, 7, 7], 7), 0);
  assert.equal(upperBound([7, 7, 7], 7), 3);
  assert.equal(lowerBound([7, 7, 7], 1), 0);
  assert.equal(lowerBound([7, 7, 7], 9), 3);
});

test("bounds match a scan on random sorted arrays", () => {
  for (let t = 0; t < 300; t++) {
    const a = Array.from({ length: Math.floor(Math.random() * 40) }, () => Math.floor(Math.random() * 20)).sort((x, y) => x - y);
    const target = Math.floor(Math.random() * 24) - 2;
    const lower = a.findIndex((x) => x >= target), upper = a.findIndex((x) => x > target);
    assert.equal(lowerBound(a, target), lower === -1 ? a.length : lower, JSON.stringify({ a, target }));
    assert.equal(upperBound(a, target), upper === -1 ? a.length : upper, JSON.stringify({ a, target }));
  }
});

test("countBetween: repeats, empty ranges, from > to", () => {
  const a = [1, 3, 7, 7, 7, 9];
  assert.equal(countBetween(a, 3, 7), 4);
  assert.equal(countBetween(a, 7, 7), 3);
  assert.equal(countBetween(a, 4, 6), 0);
  assert.equal(countBetween(a, 9, 1), 0);
  assert.equal(countBetween([], 0, 10), 0);
});

test("batch size: slow and fast agree, edges", () => {
  for (let t = 0; t < 50; t++) {
    const job = makeJob(1 + Math.floor(Math.random() * 3000));
    assert.equal(smallestBatchFast(job), smallestBatchSlow(job));
  }
  const exact = { records: [9, 4, 7, 2, 6], limit: 5 }; // one minute per task: size 9
  assert.equal(smallestBatchFast(exact), 9);
  assert.equal(smallestBatchSlow(exact), 9);
  assert.equal(smallestBatchFast({ records: [], limit: 0 }), 1);
  assert.equal(smallestBatchFast({ records: [1, 1, 1], limit: 3 }), 1);
  assert.throws(() => smallestBatchFast({ records: [5, 5], limit: 1 }), RangeError);
  assert.throws(() => smallestBatchSlow({ records: [5, 5], limit: 1 }), RangeError);
});

test("mostMeetings matches brute force, touching meetings fit", () => {
  assert.equal(mostMeetings([]).length, 0);
  assert.equal(mostMeetings([[9, 10], [10, 11], [11, 12]]).length, 3);
  for (let t = 0; t < 500; t++) {
    const ms = Array.from({ length: Math.floor(Math.random() * 9) }, (): Meeting => {
      const s = Math.floor(Math.random() * 20);
      return [s, s + 1 + Math.floor(Math.random() * 6)];
    });
    const taken = mostMeetings(ms);
    assert.equal(taken.length, mostMeetingsBrute(ms), JSON.stringify(ms));
    assert.equal(mostMeetingsBrute(taken), taken.length); // the meetings taken do not overlap
  }
});

test("mergeBusy: touching blocks stay apart, nested and empty", () => {
  assert.deepEqual(mergeBusy([]), []);
  assert.deepEqual(mergeBusy([[1, 10], [2, 3], [4, 5]]), [[1, 10]]);
  assert.deepEqual(mergeBusy([[3, 4], [1, 3]]), [[1, 3], [3, 4]]);
  const input: Meeting[] = [[5, 8], [1, 6]];
  mergeBusy(input);
  assert.deepEqual(input, [[5, 8], [1, 6]]); // the input is not changed
});
