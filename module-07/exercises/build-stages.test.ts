import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStages } from "./build-stages.ts";

test("stages of a small project", () => {
  const pkgs = new Map([
    ["app", ["ui", "api"]],
    ["ui", ["core"]],
    ["api", ["core", "db"]],
    ["core", []],
    ["db", []],
    ["docs", []],
  ]);
  assert.deepEqual(buildStages(pkgs), [["core", "db", "docs"], ["api", "ui"], ["app"]]);
});

test("a package waits for its slowest dependency", () => {
  const pkgs = new Map([["a", []], ["b", ["a"]], ["c", ["b"]], ["d", ["a", "c"]]]);
  assert.deepEqual(buildStages(pkgs), [["a"], ["b"], ["c"], ["d"]]);
});

test("empty", () => {
  assert.deepEqual(buildStages(new Map()), []);
});

test("a cycle throws", () => {
  const pkgs = new Map([["a", ["b"]], ["b", ["a"]], ["c", []]]);
  assert.throws(() => buildStages(pkgs), /cycle/);
});

test("a dependency that is not in the list throws", () => {
  assert.throws(() => buildStages(new Map([["app", ["lib"]], ["cli", []]])), /not in the list/);
});

test("a chain of 10,000 packages in under 300 ms", () => {
  const pkgs = new Map<string, string[]>();
  for (let i = 9_999; i >= 0; i--) pkgs.set(`p${i}`, i === 0 ? [] : [`p${i - 1}`]);
  const start = performance.now();
  const stages = buildStages(pkgs);
  const ms = performance.now() - start;
  assert.equal(stages.length, 10_000);
  assert.deepEqual(stages[9_999], ["p9999"]);
  assert.ok(ms < 300, `took ${Math.round(ms)} ms`);
});
