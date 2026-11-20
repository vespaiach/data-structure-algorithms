import { test } from "node:test";
import assert from "node:assert/strict";
import { firstBadBuild } from "./first-bad-build.ts";

// isBad for a run where `first` is the first bad build. It refuses calls outside 1..count.
const badFrom = (first: number, count: number) => (build: number) => {
  assert.ok(Number.isInteger(build) && build >= 1 && build <= count, `isBad(${build}) is outside 1..${count}`);
  return build >= first;
};

test("ten builds, the seventh is the first bad one", () => {
  assert.equal(firstBadBuild(10, badFrom(7, 10)), 7);
});

test("all bad, all good, one build, no builds", () => {
  assert.equal(firstBadBuild(10, badFrom(1, 10)), 1);
  assert.equal(firstBadBuild(10, badFrom(11, 10)), 11);
  assert.equal(firstBadBuild(1, badFrom(1, 1)), 1);
  assert.equal(firstBadBuild(1, badFrom(2, 1)), 2);
  assert.equal(firstBadBuild(0, badFrom(1, 0)), 1);
});

test("matches every possible first bad build for counts up to 40", () => {
  for (let count = 1; count <= 40; count++) {
    for (let first = 1; first <= count + 1; first++) assert.equal(firstBadBuild(count, badFrom(first, count)), first);
  }
});

test("a billion builds with at most 31 tests", () => {
  const count = 1_000_000_000;
  const first = 500_000_000 + Math.floor(Math.random() * 500_000_001); // in the second half
  let calls = 0;
  const isBad = (build: number) => {
    if (++calls > 31) throw new Error(`used more than 31 tests`);
    return build >= first;
  };
  assert.equal(firstBadBuild(count, isBad), first);
});
