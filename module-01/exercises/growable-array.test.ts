import { test } from "node:test";
import assert from "node:assert/strict";
import { GrowableArray } from "./growable-array.ts";

test("stores items in order", () => {
  const list = new GrowableArray<string>();
  for (const word of ["a", "b", "c"]) list.push(word);
  assert.equal(list.length, 3);
  assert.deepEqual([list.get(0), list.get(1), list.get(2)], ["a", "b", "c"]);
});

test("rejects an index outside the list", () => {
  const list = new GrowableArray<number>();
  list.push(1);
  assert.throws(() => list.get(1), RangeError);
  assert.throws(() => list.get(-1), RangeError);
});

test("capacity doubles: 1, 2, 4, 8", () => {
  const list = new GrowableArray<number>();
  const seen: number[] = [];
  for (let i = 0; i < 8; i++) {
    list.push(i);
    seen.push(list.capacity);
  }
  assert.deepEqual(seen, [1, 2, 4, 4, 8, 8, 8, 8]);
});

test("n pushes copy fewer than 2n items", () => {
  for (const n of [10, 1_000, 100_000]) {
    const list = new GrowableArray<number>();
    for (let i = 0; i < n; i++) list.push(i);
    assert.ok(list.copies < 2 * n, `${list.copies} copies for ${n} pushes`);
  }
});
