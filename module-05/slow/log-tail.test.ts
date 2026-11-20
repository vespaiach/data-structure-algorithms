import { test } from "node:test";
import assert from "node:assert/strict";
import { LogTail } from "./log-tail.ts";

test("keeps every line until it is full", () => {
  const t = new LogTail(3);
  assert.deepEqual(t.toArray(), []);
  t.push("a");
  t.push("b");
  assert.deepEqual(t.toArray(), ["a", "b"]);
  assert.equal(t.size, 2);
});
test("overwrites the oldest line when full", () => {
  const t = new LogTail(3);
  for (const line of ["a", "b", "c", "d", "e"]) t.push(line);
  assert.deepEqual(t.toArray(), ["c", "d", "e"]);
  assert.equal(t.size, 3);
});
test("capacity 1 and capacity < 1", () => {
  const t = new LogTail(1);
  t.push("a");
  t.push("b");
  assert.deepEqual(t.toArray(), ["b"]);
  assert.throws(() => new LogTail(0), RangeError);
});
test("matches slice(-capacity) of all lines, for capacities that are not powers of two", () => {
  for (const cap of [2, 5, 7, 100]) {
    const t = new LogTail(cap);
    const all: string[] = [];
    const pushes = Math.floor(Math.random() * 500);
    for (let i = 0; i < pushes; i++) {
      t.push(`line ${i}`);
      all.push(`line ${i}`);
      assert.deepEqual(t.toArray(), all.slice(-cap), `capacity ${cap}`);
    }
  }
});
test("300,000 lines into a tail of 50,000 take under 500 ms", () => {
  const t = new LogTail(50_000);
  const start = performance.now();
  for (let i = 0; i < 300_000; i++) t.push("x");
  const ms = performance.now() - start;
  assert.equal(t.size, 50_000);
  assert.ok(ms < 500, `took ${Math.round(ms)} ms`);
});
