// Exercise 4, slow answer: walk every path as long as the code, then compare the letters.
// Correct, but it never prunes on a wrong letter: about R * C * 4 * 3^(L-2) paths for every code.
export function gridHasCode(grid: string[], code: string): boolean {
  if (code.length === 0) return true;
  const rows = grid.length, cols = rows ? grid[0].length : 0;
  const used = grid.map((row) => new Array<boolean>(row.length).fill(false));
  function walk(r: number, c: number, word: string): boolean {
    if (r < 0 || c < 0 || r >= rows || c >= cols || used[r][c]) return false;
    word += grid[r][c];
    if (word.length === code.length) return word === code;
    used[r][c] = true;
    const found = walk(r + 1, c, word) || walk(r - 1, c, word) || walk(r, c + 1, word) || walk(r, c - 1, word);
    used[r][c] = false;
    return found;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (walk(r, c, "")) return true;
  return false;
}
