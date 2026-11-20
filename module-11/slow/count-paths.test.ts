import { test } from "node:test";
import assert from "node:assert/strict";
import { countPaths } from "./count-paths.ts";

// Walk every path with a stack and count the ones that reach the end: correct but slow.
function bruteForce(grid: string[]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;
  const R = grid.length, C = grid[0].length;
  let count = 0;
  const stack: [number, number][] = [[0, 0]];
  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r >= R || c >= C || grid[r][c] === "#") continue;
    if (r === R - 1 && c === C - 1) count++;
    else stack.push([r + 1, c], [r, c + 1]);
  }
  return count;
}

const open = (rows: number, cols: number) => Array.from({ length: rows }, () => ".".repeat(cols));

test("an open 3 x 3 grid has 6 paths", () => {
  assert.equal(countPaths(open(3, 3)), 6);
});

test("a blocked middle cell", () => {
  assert.equal(countPaths(["...", ".#.", "..."]), 2);
});

test("a blocked start or end", () => {
  assert.equal(countPaths(["#.", ".."]), 0);
  assert.equal(countPaths(["..", ".#"]), 0);
});

test("one cell, one row, one column, empty grids", () => {
  assert.equal(countPaths(["."]), 1);
  assert.equal(countPaths(["#"]), 0);
  assert.equal(countPaths(["....."]), 1);
  assert.equal(countPaths([".", ".", "."]), 1);
  assert.equal(countPaths([]), 0);
  assert.equal(countPaths([""]), 0);
});

test("matches a brute force on 300 random grids", () => {
  for (let t = 0; t < 300; t++) {
    const rows = 1 + Math.floor(Math.random() * 6), cols = 1 + Math.floor(Math.random() * 6);
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() < 0.2 ? "#" : ".")).join(""));
    assert.equal(countPaths(grid), bruteForce(grid), JSON.stringify(grid));
  }
});

test("an open 15 x 15 grid in under 100 ms", () => {
  const start = performance.now();
  const got = countPaths(open(15, 15));
  const ms = performance.now() - start;
  assert.equal(got, 40_116_600); // C(28, 14)
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
