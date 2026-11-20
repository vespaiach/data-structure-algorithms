import { test } from "node:test";
import assert from "node:assert/strict";
import { Heap } from "./heap.ts";

test("pops numbers in order, min-heap and max-heap", () => {
  const values = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100));
  const min = new Heap<number>((a, b) => a < b);
  for (const v of values) min.push(v);
  const out: number[] = [];
  while (min.size > 0) out.push(min.pop()!);
  assert.deepEqual(out, values.toSorted((a, b) => a - b));

  const max = new Heap<number>((a, b) => a > b, values.slice());
  const outMax: number[] = [];
  while (max.size > 0) outMax.push(max.pop()!);
  assert.deepEqual(outMax, values.toSorted((a, b) => b - a));
});

test("empty heap", () => {
  const h = new Heap<number>((a, b) => a < b);
  assert.equal(h.peek(), undefined);
  assert.equal(h.pop(), undefined);
  assert.equal(h.size, 0);
});

test("objects with a key, and replaceTop", () => {
  const h = new Heap<{ id: string; at: number }>((a, b) => a.at < b.at);
  h.push({ id: "b", at: 2 });
  h.push({ id: "a", at: 1 });
  h.push({ id: "c", at: 3 });
  assert.equal(h.replaceTop({ id: "d", at: 5 })!.id, "a");
  assert.deepEqual([h.pop()!.id, h.pop()!.id, h.pop()!.id], ["b", "c", "d"]);
});

test("bottom-up build with repeated values, and replaceTop on an empty heap", () => {
  const values = Array.from({ length: 2000 }, () => Math.floor(Math.random() * 10));
  const h = new Heap<number>((a, b) => a < b, values.slice());
  const out: number[] = [];
  while (h.size > 0) out.push(h.pop()!);
  assert.deepEqual(out, values.toSorted((a, b) => a - b));
  const e = new Heap<number>((a, b) => a < b);
  assert.equal(e.replaceTop(4), undefined); // nothing to replace: the item is simply added
  assert.equal(e.size, 1);
  assert.equal(e.pop(), 4);
});
