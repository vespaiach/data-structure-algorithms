import { test } from "node:test";
import assert from "node:assert/strict";
import { route } from "./route.ts";

type Cell = [number, number];

// A route is valid if it starts at `start`, ends at `goal`, stays on open cells
// and moves one cell up, down, left or right at each step.
function assertRoute(grid: string[], start: Cell, goal: Cell, cells: Cell[] | null, steps: number) {
  assert.ok(cells, "expected a route");
  assert.equal(cells.length, steps + 1, "fewest steps");
  assert.deepEqual(cells[0], start);
  assert.deepEqual(cells.at(-1), goal);
  for (const [r, c] of cells) assert.equal(grid[r]?.[c], ".", `cell ${r},${c} is open`);
  for (let i = 1; i < cells.length; i++) {
    const [[r1, c1], [r2, c2]] = [cells[i - 1], cells[i]];
    assert.equal(Math.abs(r1 - r2) + Math.abs(c1 - c2), 1, `step ${i} moves one cell`);
  }
}

const floor = [
  "..#....",
  ".##.##.",
  "...#...",
  "#.....#",
];

test("goes around the shelves", () => {
  assertRoute(floor, [0, 0], [0, 6], route(floor, [0, 0], [0, 6]), 12);
  assertRoute(floor, [3, 1], [0, 3], route(floor, [3, 1], [0, 3]), 11);
});

test("start equals goal", () => {
  assert.deepEqual(route(floor, [2, 2], [2, 2]), [[2, 2]]);
});

test("no route: goal on a shelf, or walled in", () => {
  assert.equal(route(floor, [0, 0], [0, 2]), null);
  assert.equal(route([".#.", "##.", "..."], [0, 0], [2, 2]), null);
});

test("an open floor of 700 x 700 in under 300 ms", () => {
  const side = 700;
  const big = Array.from({ length: side }, () => ".".repeat(side));
  const start = performance.now();
  const cells = route(big, [0, 0], [side - 1, side - 1]);
  const ms = performance.now() - start;
  assertRoute(big, [0, 0], [side - 1, side - 1], cells, 2 * (side - 1));
  assert.ok(ms < 300, `took ${Math.round(ms)} ms`);
});
