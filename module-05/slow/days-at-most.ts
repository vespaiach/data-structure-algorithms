// A correct O(n^2) answer to Exercise 4 that scans back from each day, to show that the timing test catches it.
export function daysAtMost(counts: number[]): number[] {
  return counts.map((c, i) => {
    let j = i;
    while (j >= 0 && counts[j] <= c) j--;
    return i - j;
  });
}
