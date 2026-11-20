import { test } from "node:test";
import assert from "node:assert/strict";
import { cheapestPath } from "./cheapest-path.ts";

// Fewest minutes by relaxing every cell until nothing changes (slow, but clearly right).
function byRelaxing(grid: string[]): number {
  const rows = grid.length, cols = grid[0].length;
  if (grid[0][0] === "#" || grid[rows - 1][cols - 1] === "#") return -1;
  const dist = grid.map((row) => Array.from(row, () => Infinity));
  dist[0][0] = 0;
  for (let changed = true; changed; ) {
    changed = false;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "#" || (r === 0 && c === 0)) continue;
      const best = Math.min(dist[r - 1]?.[c] ?? Infinity, dist[r + 1]?.[c] ?? Infinity, dist[r][c - 1] ?? Infinity, dist[r][c + 1] ?? Infinity) + Number(grid[r][c]);
      if (best < dist[r][c]) { dist[r][c] = best; changed = true; }
    }
  }
  return dist[rows - 1][cols - 1] === Infinity ? -1 : dist[rows - 1][cols - 1];
}

test("a longer way around can be faster", () => {
  const grid = [
    "1191",
    "1991",
    "1111",
  ];
  // down, down, right, right, right: 1 + 1 + 1 + 1 + 1 = 5
  assert.equal(cheapestPath(grid), 5);
});

test("one cell, a wall in the way, and a blocked goal", () => {
  assert.equal(cheapestPath(["7"]), 0);
  assert.equal(cheapestPath(["1#1", "##1", "111"]), -1);
  assert.equal(cheapestPath(["11", "1#"]), -1);
});

test("matches relaxing every cell on random maps", () => {
  for (let trial = 0; trial < 40; trial++) {
    const rows = 1 + Math.floor(Math.random() * 8), cols = 1 + Math.floor(Math.random() * 8);
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() < 0.2 ? "#" : String(1 + Math.floor(Math.random() * 9)))).join(""));
    assert.equal(cheapestPath(grid), byRelaxing(grid), grid.join("\n"));
  }
});

test("a 150 x 150 map in under 300 ms", () => {
  const grid = Array.from({ length: 150 }, () => Array.from({ length: 150 }, () => String(1 + Math.floor(Math.random() * 9))).join(""));
  const start = performance.now();
  const minutes = cheapestPath(grid);
  const ms = performance.now() - start;
  assert.ok(minutes >= 298 && minutes <= 298 * 9);
  assert.ok(ms < 300, `took ${Math.round(ms)} ms`);
});
