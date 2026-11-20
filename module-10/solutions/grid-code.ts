// Exercise 4: grid is a list of rows of letters, all the same length. Returns true if code can be
// spelled by starting at any cell and moving up, down, left or right, using each cell at most once.
// Start from every cell; a wrong letter ends a branch at once. Mark a cell when the path enters it
// and clear the mark when the path leaves it, so a later path can use it.
// O(R * C * 4 * 3^(L-1)) time in the worst case for an R x C grid and a code of length L: after the
// first step, at most 3 new directions (the fourth is the cell the path came from).
// O(R * C + L) memory for the marks and the recursion.
export function gridHasCode(grid: string[], code: string): boolean {
  if (code.length === 0) return true;
  const rows = grid.length, cols = rows ? grid[0].length : 0;
  const used = grid.map((row) => new Array<boolean>(row.length).fill(false));

  function explore(r: number, c: number, k: number): boolean {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (used[r][c] || grid[r][c] !== code[k]) return false; // prune: used, or the wrong letter
    if (k === code.length - 1) return true; // the last letter matched
    used[r][c] = true; // choose
    const found =
      explore(r + 1, c, k + 1) || explore(r - 1, c, k + 1) || explore(r, c + 1, k + 1) || explore(r, c - 1, k + 1);
    used[r][c] = false; // undo, even when found, so the marks are clean
    return found;
  }

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (explore(r, c, 0)) return true;
  return false;
}
