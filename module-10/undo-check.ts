// Research only: does the dead-end test catch a missing undo for every direction order? node undo-check.ts
// For every order of the four directions, a grid search without the undo must fail the dead-end test.
const dirs: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function perms<T>(xs: T[]): T[][] { return xs.length ? xs.flatMap((x, i) => perms(xs.toSpliced(i, 1)).map((p) => [x, ...p])) : [[]]; }
function noUndo(order: [number, number][]) {
  return (grid: string[], code: string): boolean => {
    const rows = grid.length, cols = grid[0].length;
    const used = grid.map((r) => new Array(r.length).fill(false));
    const ex = (r: number, c: number, k: number): boolean => {
      if (r < 0 || c < 0 || r >= rows || c >= cols || used[r][c] || grid[r][c] !== code[k]) return false;
      if (k === code.length - 1) return true;
      used[r][c] = true;
      return order.some(([dr, dc]) => ex(r + dr, c + dc, k + 1));
    };
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (ex(r, c, 0)) return true;
    return false;
  };
}
function variants(g: string[]): string[][] {
  const turn = (h: string[]) => Array.from(h[0], (_, c) => h.map((row) => row[c]).reverse().join(""));
  const mirror = (h: string[]) => h.map((row) => [...row].reverse().join(""));
  const out: string[][] = []; let cur = g;
  for (let i = 0; i < 4; i++) { out.push(cur, mirror(cur)); cur = turn(cur); }
  return out;
}
let caught = 0;
for (const order of perms(dirs)) {
  const f = noUndo(order);
  const fails = variants(["AAB", "AAC", "AAA"]).some((g) => !f(g, "AAAAAAC")) || variants(["AAAA", "ABBA", "AAAC"]).some((g) => !f(g, "AAAAAAAC"));
  if (fails) caught++;
}
console.log(`no-undo versions caught: ${caught} of 24 direction orders`);
