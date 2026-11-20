// Practice 5: freeCores[h] is how many CPU cores are free in hour h (a whole number from 0 to
// 10,000). A job takes the same c cores for a run of consecutive hours, so every hour of the run
// needs at least c free cores. Returns the largest c * hours one job can get. Up to 200,000 hours.
// Pattern: a monotonic stack (Module 5). The best job limited by hour h runs from just after the
// previous hour with fewer cores to just before the next hour with fewer. The stack holds hours
// whose run hasn't ended, with cores rising from bottom to top. An hour pops every hour with at
// least as many cores, which ends their runs; the hour left below a popped one has fewer cores, so
// the run starts just after it. (Of two equal hours, the first one's run is cut short, but the
// second one's run covers it.) O(n) time: each hour is pushed once and popped once. O(n) memory.
export function largestBlock(freeCores: number[]): number {
  const n = freeCores.length;
  const waiting: number[] = [];
  let best = 0;
  for (let h = 0; h <= n; h++) {
    const cores = h < n ? freeCores[h] : -1; // a last hour with fewer cores than any, to empty the stack
    while (waiting.length > 0 && freeCores[waiting.at(-1)!] >= cores) {
      const limit = freeCores[waiting.pop()!];
      const from = waiting.length > 0 ? waiting.at(-1)! + 1 : 0; // the run starts after the hour below
      best = Math.max(best, limit * (h - from));
    }
    waiting.push(h);
  }
  return best;
}
