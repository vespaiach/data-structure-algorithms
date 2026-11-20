// Memo keys for a state of two numbers: a string, one number, or no Map at all: node keys.ts
// Problem: the cheapest path from the top-left cell of a grid of costs to the bottom-right cell,
// moving only right or down. The cost of a path is the sum of its cells. The grid has at least one cell.
import assert from "node:assert/strict";
import { bench } from "./bench.ts";

// An n x n grid of costs from 1 to 9.
export function makeCosts(n: number): number[][] {
  return Array.from({ length: n }, () => Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 9)));
}

// Top down, key `${r},${c}`: builds and hashes a new string for every lookup. O(R * C) time and memory.
export function minCostStringKey(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const memo = new Map<string, number>();
  function best(r: number, c: number): number {
    if (r >= R || c >= C) return Infinity; // off the grid
    if (r === R - 1 && c === C - 1) return grid[r][c];
    const key = `${r},${c}`;
    const known = memo.get(key);
    if (known !== undefined) return known;
    const result = grid[r][c] + Math.min(best(r + 1, c), best(r, c + 1));
    memo.set(key, result);
    return result;
  }
  return best(0, 0);
}

// Top down, key r * C + c: one number per cell, unique because 0 <= c < C. O(R * C) time and memory.
export function minCostNumberKey(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const memo = new Map<number, number>();
  function best(r: number, c: number): number {
    if (r >= R || c >= C) return Infinity;
    if (r === R - 1 && c === C - 1) return grid[r][c];
    const key = r * C + c;
    const known = memo.get(key);
    if (known !== undefined) return known;
    const result = grid[r][c] + Math.min(best(r + 1, c), best(r, c + 1));
    memo.set(key, result);
    return result;
  }
  return best(0, 0);
}

// Bottom up, a table filled from the bottom-right corner. O(R * C) time and memory, no Map, no recursion.
export function minCostTable(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const best = Array.from({ length: R + 1 }, () => new Array<number>(C + 1).fill(Infinity)); // row R and column C: off the grid
  for (let r = R - 1; r >= 0; r--)
    for (let c = C - 1; c >= 0; c--)
      best[r][c] = r === R - 1 && c === C - 1 ? grid[r][c] : grid[r][c] + Math.min(best[r + 1][c], best[r][c + 1]);
  return best[0][0];
}

// Bottom up with one row: before row[c] is overwritten, it holds the answer for the cell below.
// O(R * C) time, O(C) memory.
export function minCostRow(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const row = new Array<number>(C + 1).fill(Infinity);
  for (let r = R - 1; r >= 0; r--)
    for (let c = C - 1; c >= 0; c--)
      row[c] = r === R - 1 && c === C - 1 ? grid[r][c] : grid[r][c] + Math.min(row[c], row[c + 1]);
  return row[0];
}

let sink = 0;

if (process.argv[1] === import.meta.filename) {
  for (let t = 0; t < 20; t++) {
    const g = makeCosts(1 + Math.floor(Math.random() * 40));
    const answers = [minCostStringKey, minCostNumberKey, minCostTable, minCostRow].map((f) => f(g));
    assert.ok(answers.every((a) => a === answers[0]), JSON.stringify(answers));
  }
  console.log("the four versions agree on 20 random grids: true");

  const sizes = [200, 400, 800];
  bench("string key `${r},${c}`", sizes, makeCosts, (g) => (sink += minCostStringKey(g)));
  bench("number key r * C + c", sizes, makeCosts, (g) => (sink += minCostNumberKey(g)));
  bench("bottom-up table", sizes, makeCosts, (g) => (sink += minCostTable(g)));
  bench("bottom-up, one row", sizes, makeCosts, (g) => (sink += minCostRow(g)));
  if (sink === 0) console.log(sink);
}
