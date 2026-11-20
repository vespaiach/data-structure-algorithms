import { test } from "node:test";
import assert from "node:assert/strict";
import { findCycle } from "./find-cycle.ts";

// A cycle is valid if it starts and ends with the same package and each
// package depends on the next one.
function assertCycle(pkgs: Map<string, string[]>, cycle: string[] | null) {
  assert.ok(cycle, "expected a cycle");
  assert.ok(cycle.length >= 2);
  assert.equal(cycle[0], cycle[cycle.length - 1]);
  for (let i = 0; i + 1 < cycle.length; i++) assert.ok(pkgs.get(cycle[i])?.includes(cycle[i + 1]), `${cycle[i]} -> ${cycle[i + 1]}`);
}

test("no cycle", () => {
  const pkgs = new Map([["app", ["ui", "api"]], ["ui", ["core"]], ["api", ["core"]], ["core", []]]);
  assert.equal(findCycle(pkgs), null);
});

test("a diamond is not a cycle", () => {
  const pkgs = new Map([["a", ["b", "c"]], ["b", ["d"]], ["c", ["d"]], ["d", []]]);
  assert.equal(findCycle(pkgs), null);
});

test("two packages that need each other", () => {
  const pkgs = new Map([["app", ["api"]], ["api", ["auth"]], ["auth", ["api"]]]);
  assertCycle(pkgs, findCycle(pkgs));
});

test("a package that depends on itself", () => {
  const pkgs = new Map([["a", ["a"]]]);
  assert.deepEqual(findCycle(pkgs), ["a", "a"]);
});

test("a cycle reached late, after a shared dependency", () => {
  const pkgs = new Map([["a", ["c", "b"]], ["b", ["c"]], ["c", ["d"]], ["d", []], ["e", ["f"]], ["f", ["g"]], ["g", ["e"]]]);
  assertCycle(pkgs, findCycle(pkgs));
});

test("a chain of 100,000 packages, without and with a cycle", () => {
  const pkgs = new Map<string, string[]>();
  for (let i = 0; i < 100_000; i++) pkgs.set(`p${i}`, i === 99_999 ? [] : [`p${i + 1}`]);
  assert.equal(findCycle(pkgs), null);
  pkgs.set("p99999", ["p0"]);
  const cycle = findCycle(pkgs);
  assertCycle(pkgs, cycle);
  assert.equal(cycle!.length, 100_001);
});
