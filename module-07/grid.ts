// Fewest steps across a warehouse floor, breadth first: node grid.ts
// The floor is a graph that nobody stores: each open cell is a node, and its open neighbours are its edges.
import { bench } from "./bench.ts";
import { Deque } from "./deque.ts";

export type Grid = string[]; // one string per row: "." open, "#" shelf

// A side x side floor with about 25% shelves. The top row and the right column stay open,
// so there is always a way from the top-left corner to the bottom-right one.
export function makeGrid(side: number): Grid {
  const rows: string[] = [];
  for (let r = 0; r < side; r++) {
    let row = "";
    for (let c = 0; c < side; c++) row += r > 0 && c < side - 1 && Math.random() < 0.25 ? "#" : ".";
    rows.push(row);
  }
  return rows;
}

const MOVES = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

// Fewest steps from the top-left cell to the bottom-right cell, or -1 if there is no way.
// Queue items are [row, col, steps], and a Set of "row,col" strings is the visited set.
// O(R * C) time and memory: each cell is queued at most once and has at most four neighbours.
export function fewestStepsStrings(grid: Grid): number {
  const rows = grid.length, cols = grid[0].length;
  if (grid[0][0] === "#") return -1;
  const seen = new Set<string>(["0,0"]);
  const queue = new Deque<[number, number, number]>();
  queue.push([0, 0, 0]);
  while (queue.size > 0) {
    const [r, c, steps] = queue.shift()!;
    if (r === rows - 1 && c === cols - 1) return steps;
    for (const [dr, dc] of MOVES) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] === "#") continue;
      const key = `${nr},${nc}`;
      if (seen.has(key)) continue;
      seen.add(key); // mark when queued
      queue.push([nr, nc, steps + 1]);
    }
  }
  return -1;
}

// The same search with numbered cells: cell (r, c) is number r * cols + c. One Int32Array holds
// the steps to each cell, and -1 means "not reached yet", so it is also the visited set.
// O(R * C) time and memory, with no string and no array made per cell.
export function fewestSteps(grid: Grid): number {
  const rows = grid.length, cols = grid[0].length;
  if (grid[0][0] === "#") return -1;
  const dist = new Int32Array(rows * cols).fill(-1);
  const queue = new Deque<number>();
  dist[0] = 0;
  queue.push(0);
  while (queue.size > 0) {
    const cell = queue.shift()!;
    const r = Math.floor(cell / cols), c = cell % cols;
    if (r === rows - 1 && c === cols - 1) return dist[cell];
    for (const [dr, dc] of MOVES) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] === "#") continue;
      const next = nr * cols + nc;
      if (dist[next] !== -1) continue;
      dist[next] = dist[cell] + 1; // mark when queued
      queue.push(next);
    }
  }
  return -1;
}

if (process.argv[1] === import.meta.filename) {
  const floor = ["...#", ".#..", ".#.#", "...."];
  console.log("small floor:", fewestStepsStrings(floor), fewestSteps(floor));
  const cells = [250_000, 500_000, 1_000_000]; // sides 500, 707 and 1,000
  const floorOf = (n: number) => makeGrid(Math.round(Math.sqrt(n)));
  bench("fewestStepsStrings (cells)", cells, floorOf, fewestStepsStrings);
  bench("fewestSteps (cells)", cells, floorOf, fewestSteps);
}
