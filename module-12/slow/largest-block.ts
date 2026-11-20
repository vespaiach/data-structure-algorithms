// Practice 5: freeCores[h] is how many CPU cores are free in hour h (a whole number from 0 to
// 10,000). A job takes the same c cores for a run of consecutive hours, so every hour of the run
// needs at least c free cores. Returns the largest c * hours one job can get. Up to 200,000 hours.
// Slow: every start hour, extended one hour at a time with the fewest cores so far. Correct, but
// O(n^2) time. O(1) memory.
export function largestBlock(freeCores: number[]): number {
  let best = 0;
  for (let from = 0; from < freeCores.length; from++) {
    let fewest = Infinity;
    for (let to = from; to < freeCores.length; to++) {
      fewest = Math.min(fewest, freeCores[to]);
      best = Math.max(best, fewest * (to - from + 1));
    }
  }
  return best;
}
