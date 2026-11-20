import { test } from "node:test";
import assert from "node:assert/strict";
import { fromArray, toArray } from "./list.ts";
import { reverseList } from "./reverse.ts";

test("reverses a list of undo steps", () => {
  assert.deepEqual(toArray(reverseList(fromArray(["type", "bold", "delete"]))), ["delete", "bold", "type"]);
});
test("empty and one-node lists", () => {
  assert.equal(reverseList(null), null);
  assert.deepEqual(toArray(reverseList(fromArray([1]))), [1]);
});
test("reuses the same nodes", () => {
  const head = fromArray([1, 2, 3])!;
  const last = head.next!.next!;
  assert.equal(reverseList(head), last);
  assert.equal(head.next, null);
});
test("100,000 nodes without a stack overflow", () => {
  const n = 100_000;
  const out = toArray(reverseList(fromArray(Array.from({ length: n }, (_, i) => i))));
  assert.equal(out[0], n - 1);
  assert.equal(out[n - 1], 0);
});
