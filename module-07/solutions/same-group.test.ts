import { test } from "node:test";
import assert from "node:assert/strict";
import { sameGroup } from "./same-group.ts";

test("two groups", () => {
  const links: [number, number][] = [[0, 1], [1, 2], [3, 4]];
  assert.deepEqual(sameGroup(5, links, [[0, 2], [2, 0], [0, 3], [3, 4], [4, 1]]), [true, true, false, true, false]);
});

test("a server with itself, no links, repeated links and a link to itself", () => {
  assert.deepEqual(sameGroup(3, [], [[1, 1], [0, 2]]), [true, false]);
  assert.deepEqual(sameGroup(4, [[0, 1], [1, 0], [2, 2]], [[0, 1], [2, 3], [2, 2]]), [true, false, true]);
  assert.deepEqual(sameGroup(2, [[0, 1]], []), []);
});

test("a chain of 200,000 servers", () => {
  const n = 200_000;
  const links: [number, number][] = [];
  for (let i = 1; i < n; i++) links.push([i - 1, i]);
  assert.deepEqual(sameGroup(n, links, [[0, n - 1]]), [true]);
});

test("300 questions on two chains of 100,000 servers in under 300 ms", () => {
  const half = 100_000;
  const links: [number, number][] = [];
  for (let i = 1; i < half; i++) links.push([i - 1, i], [half + i - 1, half + i]);
  const pairs: [number, number][] = Array.from({ length: 300 }, () => [Math.floor(Math.random() * 2 * half), Math.floor(Math.random() * 2 * half)]);
  const start = performance.now();
  const answers = sameGroup(2 * half, links, pairs);
  const ms = performance.now() - start;
  assert.deepEqual(answers, pairs.map(([a, b]) => a < half === b < half));
  assert.ok(ms < 300, `took ${Math.round(ms)} ms`);
});
