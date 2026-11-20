// The longest run of consecutive requests whose total size stays within `budget` bytes.
// Growing window: `right` adds a request; while the window is over budget, `left` drops one.
// Each index enters and leaves the window once: O(n) time, O(1) extra memory.
// Works because sizes are never negative: dropping a request never raises the total.
export function longestUnderBudget(sizes: number[], budget: number): number {
  let left = 0;
  let total = 0;
  let best = 0;
  for (let right = 0; right < sizes.length; right++) {
    total += sizes[right];
    while (total > budget) {
      total -= sizes[left];
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
