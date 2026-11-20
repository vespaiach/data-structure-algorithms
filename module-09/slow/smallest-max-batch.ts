// A correct but slow answer to Exercise 4: try every limit from the largest file up, as the
// opening tried every batch size. O(n * (answer - largest file)).
export function smallestMaxBatch(files: number[], k: number): number {
  let limit = Math.max(0, ...files);
  while (true) {
    let batches = 1, current = 0;
    for (const f of files) {
      if (current + f > limit) {
        batches++;
        current = 0;
      }
      current += f;
    }
    if (batches <= k) return limit;
    limit++;
  }
}
