// Opening problem: the smallest batch size that finishes a job in time. The slow version: node opening-slow.ts
import { bench } from "./bench.ts";

// A job is a list of tasks, each with a number of records, and a time limit in minutes.
export type Job = { records: number[]; limit: number };

// 1,000 tasks of 1 to maxRecords records each; the limit is 2 minutes per task.
export function makeJob(maxRecords: number): Job {
  const records = Array.from({ length: 1000 }, () => 1 + Math.floor(Math.random() * maxRecords));
  return { records, limit: 2 * records.length };
}

// Minutes the job takes when a worker handles `size` records per minute, one task at a time.
// A part-full batch still takes a whole minute. O(n) for n tasks.
export function minutesFor(records: number[], size: number): number {
  let minutes = 0;
  for (const r of records) minutes += Math.ceil(r / size);
  return minutes;
}

// Try 1, 2, 3, ... until a size fits. O(n * answer) time, O(1) memory.
export function smallestBatchSlow({ records, limit }: Job): number {
  if (records.length > limit) throw new RangeError("no size fits: every task needs at least a minute");
  for (let size = 1; ; size++) if (minutesFor(records, size) <= limit) return size;
}

if (process.argv[1] === import.meta.filename) {
  const job = { records: [9, 4, 7, 2, 6], limit: 10 };
  console.log("records 9 4 7 2 6, limit 10 minutes -> size", smallestBatchSlow(job));
  // The sizes are M, the largest number of records a task can have.
  bench("smallestBatchSlow (n is M)", [250_000, 500_000, 1_000_000], makeJob, smallestBatchSlow);
}
