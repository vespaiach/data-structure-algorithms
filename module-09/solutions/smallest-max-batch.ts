// Exercise 4: upload files in their given order in at most k batches; each batch is a run of
// consecutive files. Returns the smallest possible size of the largest batch.
// Binary search on the answer: a limit works if a greedy pass (fill each batch until the next
// file would go over) needs at most k batches. O(n log S) time for S = total size, O(1) memory.
export function smallestMaxBatch(files: number[], k: number): number {
  const batchesNeeded = (limit: number): number => {
    let batches = 1, current = 0;
    for (const f of files) {
      if (current + f > limit) { // f starts a new batch
        batches++;
        current = 0;
      }
      current += f;
    }
    return batches;
  };
  let lo = 0, hi = 0;
  for (const f of files) {
    lo = Math.max(lo, f); // a batch must hold the largest file
    hi += f; // one batch holds everything
  }
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (batchesNeeded(mid) <= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
