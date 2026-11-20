// Three problems that ask "is there a total of T?" and need three different patterns: node opening.ts

// A. Two prices, at different positions, that add up to total? Hashing (Module 3): O(n) time, O(n) memory.
export function hasPairWithTotal(prices: number[], total: number): boolean {
  const seen = new Set<number>();
  for (const p of prices) {
    if (seen.has(total - p)) return true;
    seen.add(p);
  }
  return false;
}

// B. A run of consecutive minutes that adds up to total? Every count is positive, so adding a minute
// only raises the sum and dropping one only lowers it. Sliding window (Module 2): O(n) time, O(1) memory.
export function hasRunWithTotal(counts: number[], total: number): boolean {
  let left = 0;
  let sum = 0;
  for (let right = 0; right < counts.length; right++) {
    sum += counts[right];
    while (sum > total && left <= right) sum -= counts[left++];
    if (sum === total && left <= right) return true; // left <= right: the run is not empty
  }
  return false;
}

// C. Any group of costs (positive whole numbers) that adds up to total? The empty group adds up to 0.
// Dynamic programming over the totals, one row filled high to low so each cost is used once (Module 11):
// O(n * total) time, O(total) memory.
export function hasGroupWithTotal(costs: number[], total: number): boolean {
  if (total < 0) return false;
  const reachable = new Array<boolean>(total + 1).fill(false);
  reachable[0] = true;
  for (const c of costs) for (let t = total; t >= c; t--) if (reachable[t - c]) reachable[t] = true;
  return reachable[total];
}

if (process.argv[1] === import.meta.filename) {
  const xs = [8, 3, 5, 9, 1];
  for (const t of [12, 16, 22])
    console.log(`total ${t}: pair ${hasPairWithTotal(xs, t)}, run ${hasRunWithTotal(xs, t)}, group ${hasGroupWithTotal(xs, t)}`);
}
