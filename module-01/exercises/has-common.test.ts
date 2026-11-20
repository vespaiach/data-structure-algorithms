import { test } from "node:test";
import assert from "node:assert/strict";
import { hasCommon } from "./has-common.ts";

test("finds a shared address", () => {
  assert.equal(hasCommon(["a@x.io", "b@x.io"], ["c@x.io", "b@x.io"]), true);
});

test("no shared address", () => {
  assert.equal(hasCommon(["a@x.io"], ["c@x.io"]), false);
});

test("empty lists", () => {
  assert.equal(hasCommon([], ["a@x.io"]), false);
  assert.equal(hasCommon(["a@x.io"], []), false);
});

test("two lists of 10,000 addresses take under 500 ms", () => {
  const a = Array.from({ length: 10_000 }, (_, i) => `user${i}@a.io`);
  const b = Array.from({ length: 10_000 }, (_, i) => `user${i}@b.io`);
  const start = performance.now();
  assert.equal(hasCommon(a, b), false);
  const ms = performance.now() - start;
  assert.ok(ms < 500, `took ${ms.toFixed(0)} ms`);
});
