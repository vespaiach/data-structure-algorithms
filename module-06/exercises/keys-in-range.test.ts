import { test } from "node:test";
import assert from "node:assert/strict";
import { build, shuffled } from "../bst.ts";
import { keysInRange } from "./keys-in-range.ts";

test("prices between 20 and 50", () => {
  const root = build([40, 20, 60, 10, 30, 50, 70]);
  assert.deepEqual(keysInRange(root, 20, 50), [20, 30, 40, 50]);
  assert.deepEqual(keysInRange(root, 21, 49), [30, 40]);
});
test("empty tree and empty range", () => {
  assert.deepEqual(keysInRange(null, 0, 10), []);
  assert.deepEqual(keysInRange(build([5, 3, 8]), 6, 7), []);
  assert.deepEqual(keysInRange(build([5, 3, 8]), 9, 2), []);
});
test("a range above every key", () => {
  assert.deepEqual(keysInRange(build([5, 3, 8]), 9, 20), []);
});
test("matches a filter on a large tree", () => {
  const root = build(shuffled(50_000));
  assert.deepEqual(keysInRange(root, 1000, 1500), Array.from({ length: 501 }, (_, i) => 1000 + i));
  assert.deepEqual(keysInRange(root, -10, 2), [0, 1, 2]);
  assert.deepEqual(keysInRange(root, 49_998, 60_000), [49_998, 49_999]);
});
test("a tall tree of sorted keys", () => {
  const root = build(Array.from({ length: 20_000 }, (_, i) => i));
  assert.deepEqual(keysInRange(root, 19_998, 30_000), [19_998, 19_999]);
});
test("500 narrow ranges on 100,000 shuffled keys in under 200 ms", () => {
  const root = build(shuffled(100_000));
  let found = 0;
  const start = performance.now();
  for (let q = 0; q < 500; q++) {
    const low = Math.floor(Math.random() * 99_990);
    found += keysInRange(root, low, low + 9).length;
  }
  const ms = performance.now() - start;
  assert.equal(found, 5_000);
  assert.ok(ms < 200, `took ${Math.round(ms)} ms`);
});
