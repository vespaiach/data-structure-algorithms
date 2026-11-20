// Practice 4: slots holds the positions of the free slots along one row of racks: distinct whole
// numbers from 0 to 10^9, in any order. Put k replicas in k different slots so that the smallest
// distance between two replicas is as large as possible, and return that distance.
// 2 <= k <= slots.length <= 100,000.
// Slow: try d = 1, 2, 3, ... with the greedy check until one doesn't fit. Correct, but the number
// of checks is the answer itself, up to 10^9: O(n log n + n * answer) time, O(n) memory.
export function widestSpacing(slots: number[], k: number): number {
  const sorted = slots.toSorted((a, b) => a - b);
  const fits = (d: number): boolean => {
    let placed = 1;
    let last = sorted[0];
    for (const s of sorted) {
      if (s - last >= d) {
        placed++;
        last = s;
        if (placed === k) return true;
      }
    }
    return false;
  };
  let d = 1;
  while (fits(d + 1)) d++;
  return d;
}
