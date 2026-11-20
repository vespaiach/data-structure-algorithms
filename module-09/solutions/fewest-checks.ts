// Exercise 3: each job has a maintenance window [start, end] of whole minutes, both ends
// included. A health check at minute m covers every job whose window contains m. Returns the
// fewest checks that cover every job.
// Greedy, earliest end first: a window that no check covers yet gets a check at its end,
// the latest minute that still covers it. O(n log n) time, O(n) memory for the sorted copy.
export function fewestChecks(windows: [number, number][]): number {
  let checks = 0, last = -Infinity; // the minute of the latest check
  for (const [start, end] of windows.toSorted((a, b) => a[1] - b[1])) {
    if (start > last) { // the latest check came before this window opened
      checks++;
      last = end;
    }
  }
  return checks;
}
