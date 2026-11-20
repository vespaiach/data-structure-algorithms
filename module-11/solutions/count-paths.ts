// Exercise 2: grid is a list of rows of equal length, "." for an open cell and "#" for a blocked
// one. Returns how many paths go from the top-left cell to the bottom-right cell, moving only
// right or down through open cells. An empty grid has 0 paths. Counts stay below 2^53.
// State: paths(r, c) = paths(r - 1, c) + paths(r, c - 1), and 0 for a blocked cell.
// One row: before row[c] is overwritten, it holds the count for the cell above.
// O(R * C) time, O(C) memory.
export function countPaths(grid: string[]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;
  const cols = grid[0].length;
  const row = new Array<number>(cols).fill(0);
  row[0] = 1; // one way to stand on the start cell, if it's open
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "#") row[c] = 0;
      else if (c > 0) row[c] += row[c - 1]; // from above (the old row[c]) plus from the left
    }
  return row[cols - 1];
}
