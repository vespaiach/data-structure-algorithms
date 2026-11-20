import { Deque } from "../deque.ts";

// Exercise 2: the cells of a shortest way from `start` to `goal`, both included, moving up, down,
// left or right through open cells ("." open, "#" shelf). null if there is no way.
// Breadth first on numbered cells, with an Int32Array from each cell to the cell it was reached
// from (-1: not reached yet). O(R * C) time and memory, plus O(L) to rebuild a route of L cells.
export function route(grid: string[], start: [number, number], goal: [number, number]): [number, number][] | null {
  const rows = grid.length, cols = rows > 0 ? grid[0].length : 0;
  const open = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols && grid[r][c] === ".";
  if (!open(start[0], start[1]) || !open(goal[0], goal[1])) return null;
  const from = new Int32Array(rows * cols).fill(-1);
  const first = start[0] * cols + start[1], last = goal[0] * cols + goal[1];
  from[first] = first; // the start is reached from itself
  const queue = new Deque<number>();
  queue.push(first);
  while (queue.size > 0) {
    const cell = queue.shift()!;
    if (cell === last) {
      const cells: [number, number][] = [];
      for (let x = last; ; x = from[x]) {
        cells.push([Math.floor(x / cols), x % cols]);
        if (x === first) return cells.reverse();
      }
    }
    const r = Math.floor(cell / cols), c = cell % cols;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (!open(nr, nc) || from[nr * cols + nc] !== -1) continue;
      from[nr * cols + nc] = cell; // mark when queued
      queue.push(nr * cols + nc);
    }
  }
  return null;
}
