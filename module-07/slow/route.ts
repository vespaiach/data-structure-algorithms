import { Deque } from "../deque.ts";

// A correct but slow answer to Exercise 2: every queue item carries a copy of its whole route,
// so each step copies up to L cells. O(R * C * L) time and memory for routes of L cells.
export function route(grid: string[], start: [number, number], goal: [number, number]): [number, number][] | null {
  const rows = grid.length, cols = rows > 0 ? grid[0].length : 0;
  const open = (r: number, c: number) => r >= 0 && c >= 0 && r < rows && c < cols && grid[r][c] === ".";
  if (!open(start[0], start[1]) || !open(goal[0], goal[1])) return null;
  const seen = new Uint8Array(rows * cols);
  seen[start[0] * cols + start[1]] = 1;
  const queue = new Deque<[number, number][]>();
  queue.push([start]);
  while (queue.size > 0) {
    const cells = queue.shift()!;
    const [r, c] = cells.at(-1)!;
    if (r === goal[0] && c === goal[1]) return cells;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (!open(nr, nc) || seen[nr * cols + nc]) continue;
      seen[nr * cols + nc] = 1;
      queue.push([...cells, [nr, nc]]);
    }
  }
  return null;
}
