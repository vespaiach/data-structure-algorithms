// Exercise 3: a map of rows where a digit 1 to 9 is the minutes it takes to enter that cell,
// and "#" cannot be entered. Moving up, down, left or right, return the fewest minutes from the
// top-left cell to the bottom-right cell (the start cell costs nothing), or -1 if there is no way.
// Dijkstra with lazy deletion on numbered cells: cell (r, c) is r * cols + c.
// O(R * C * log(R * C)) time, O(R * C) memory.
import { Heap } from "../heap.ts";

export function cheapestPath(grid: string[]): number {
  const rows = grid.length, cols = rows > 0 ? grid[0].length : 0;
  if (rows === 0 || grid[0][0] === "#" || grid[rows - 1][cols - 1] === "#") return -1;
  const dist = new Float64Array(rows * cols).fill(Infinity);
  const done = new Uint8Array(rows * cols);
  const heap = new Heap<[number, number]>((a, b) => a[0] < b[0]); // [minutes, cell]
  const goal = rows * cols - 1;
  dist[0] = 0;
  heap.push([0, 0]);
  while (heap.size > 0) {
    const [d, cell] = heap.pop()!;
    if (done[cell]) continue; // a stale entry
    if (cell === goal) return d;
    done[cell] = 1;
    const r = Math.floor(cell / cols), c = cell % cols;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] === "#") continue;
      const next = nr * cols + nc, nd = d + Number(grid[nr][nc]);
      if (nd < dist[next]) {
        dist[next] = nd;
        heap.push([nd, next]);
      }
    }
  }
  return -1;
}
