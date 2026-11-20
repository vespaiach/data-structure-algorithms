// The smallest batch size with binary search on the answer: node opening-fast.ts
import { bench } from "./bench.ts";
import { type Job, makeJob, minutesFor, smallestBatchSlow } from "./opening-slow.ts";

// Every size below the answer is too small, and every size from it up fits.
// Search [lo, hi]: lo is never above the answer, and hi always fits.
// O(n log M) time for n tasks and the largest task M. O(1) memory.
export function smallestBatchFast({ records, limit }: Job): number {
  if (records.length > limit) throw new RangeError("no size fits: every task needs at least a minute");
  let lo = 1, hi = 1;
  for (const r of records) if (r > hi) hi = r; // one batch per task: n minutes, which fits
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (minutesFor(records, mid) <= limit) hi = mid; // mid fits: the answer is mid or smaller
    else lo = mid + 1; // mid is too small, and so is everything below it
  }
  return lo;
}

if (process.argv[1] === import.meta.filename) {
  const job = makeJob(5_000);
  console.log("same answer:", smallestBatchSlow(job), smallestBatchFast(job));
  const sizes = [250_000, 500_000, 1_000_000];
  bench("smallestBatchSlow (n is M)", sizes, makeJob, smallestBatchSlow);
  bench("smallestBatchFast (n is M)", sizes, makeJob, smallestBatchFast);
  bench("smallestBatchFast, larger (n is M)", [1e9, 1e12, 1e15], makeJob, smallestBatchFast);
}
