import { test } from "node:test";
import assert from "node:assert/strict";
import { missingIds } from "./missing-ids.ts";

test("lists missing IDs in expected order", () => {
  assert.deepEqual(missingIds(["a", "b", "c", "d"], ["d", "b", "x"]), ["a", "c"]);
});

test("nothing missing, nothing received", () => {
  assert.deepEqual(missingIds(["a", "b"], ["b", "a"]), []);
  assert.deepEqual(missingIds(["a", "b"], []), ["a", "b"]);
  assert.deepEqual(missingIds([], ["a"]), []);
});

test("100,000 expected and 100,000 received take under 200 ms", () => {
  const expected = Array.from({ length: 100_000 }, (_, i) => `id-${i}`);
  const received = expected.filter((_, i) => i % 10 !== 0);
  const start = performance.now();
  const missing = missingIds(expected, received);
  const ms = performance.now() - start;
  assert.equal(missing.length, 10_000);
  assert.ok(ms < 200, `took ${ms.toFixed(0)} ms`);
});
