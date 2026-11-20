// Exercise 2, slow answer: the recursion without a memo. Correct, but it walks every path one
// cell at a time, so its cost grows with the number of paths: C(R + C - 2, R - 1) on an open grid.
export function countPaths(grid: string[]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;
  const R = grid.length, C = grid[0].length;
  function paths(r: number, c: number): number {
    if (r >= R || c >= C || grid[r][c] === "#") return 0;
    if (r === R - 1 && c === C - 1) return 1;
    return paths(r + 1, c) + paths(r, c + 1);
  }
  return paths(0, 0);
}
