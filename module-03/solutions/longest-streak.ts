// A user's active days, as day numbers in any order, maybe repeated.
// Return the length of the longest run of consecutive days (5, 6, 7 is a run of 3).
// Put the days in a Set. Only start counting at a day whose previous day is absent,
// so every day is visited by at most one count: O(n) average time, O(n) extra memory.
// Sorting first and scanning neighbours also works, in O(n log n) time.
export function longestStreak(days: number[]): number {
  const active = new Set(days);
  let best = 0;
  for (const day of active) {
    if (active.has(day - 1)) continue; // not the first day of its run
    let length = 1;
    while (active.has(day + length)) length++;
    best = Math.max(best, length);
  }
  return best;
}
