// Practice 4: slots holds the positions of the free slots along one row of racks: distinct whole
// numbers from 0 to 10^9, in any order. Put k replicas in k different slots so that the smallest
// distance between two replicas is as large as possible, and return that distance.
// 2 <= k <= slots.length <= 100,000.
// Pattern: binary search on the answer (Module 9). fits(d) asks "can k replicas sit at least d
// apart?" and answers it greedily: take the first slot, then each slot at least d past the last
// one taken. A d that fits makes every smaller d fit, so search for the smallest d that does not
// fit; the answer is one less. O(n log n) for the sort, plus O(n) per check and O(log R) checks
// for R = the distance from the first slot to the last: O(n log n + n log R) time, O(n) memory.
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
  let lo = 1; // 1 always fits: the slots are distinct whole numbers
  let hi = sorted[sorted.length - 1] - sorted[0] + 1; // never fits: wider than the whole row
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (fits(mid)) lo = mid + 1;
    else hi = mid; // mid doesn't fit: the first d that doesn't is mid or smaller
  }
  return lo - 1;
}
