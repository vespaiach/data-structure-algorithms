import { test } from "node:test";
import assert from "node:assert/strict";
import { fromArray, toArray } from "../list.ts";
import { mergeSorted, type Entry } from "./merge-sorted.ts";

const e = (time: number, text: string): Entry => ({ time, text });

test("interleaves two logs", () => {
  const a = fromArray([e(1, "a1"), e(4, "a4"), e(9, "a9")]);
  const b = fromArray([e(2, "b2"), e(3, "b3"), e(10, "b10")]);
  assert.deepEqual(toArray(mergeSorted(a, b)).map((x) => x.text), ["a1", "b2", "b3", "a4", "a9", "b10"]);
});
test("equal times keep a before b", () => {
  const out = toArray(mergeSorted(fromArray([e(5, "a")]), fromArray([e(5, "b")])));
  assert.deepEqual(out.map((x) => x.text), ["a", "b"]);
});
test("one or both lists empty", () => {
  assert.equal(mergeSorted(null, null), null);
  assert.deepEqual(toArray(mergeSorted(null, fromArray([e(1, "b")]))).map((x) => x.text), ["b"]);
  assert.deepEqual(toArray(mergeSorted(fromArray([e(1, "a")]), null)).map((x) => x.text), ["a"]);
});
test("reuses the input nodes", () => {
  const a = fromArray([e(1, "a")])!;
  const b = fromArray([e(2, "b")])!;
  const head = mergeSorted(a, b);
  assert.equal(head, a);
  assert.equal(a.next, b);
});
