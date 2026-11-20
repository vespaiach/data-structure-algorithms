// A correct but slow answer to Exercise 3: find the uncovered window that ends first with a scan,
// check at its end, then scan again to mark every window that check covers. O(n * checks).
export function fewestChecks(windows: [number, number][]): number {
  const covered = new Uint8Array(windows.length);
  let checks = 0;
  while (true) {
    let first = -1;
    for (let i = 0; i < windows.length; i++) {
      if (!covered[i] && (first === -1 || windows[i][1] < windows[first][1])) first = i;
    }
    if (first === -1) return checks;
    const m = windows[first][1];
    checks++;
    for (let i = 0; i < windows.length; i++) if (windows[i][0] <= m && m <= windows[i][1]) covered[i] = 1;
  }
}
