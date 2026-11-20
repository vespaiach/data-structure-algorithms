// Research only: where does smallestBatchFast slow down as M grows? node smi-step.ts
// Times it with 21 runs per size, around 2^31 - 1, the largest Smi in this Node.js build.
import { bench } from "./bench.ts";
import { makeJob } from "./opening-slow.ts";
import { smallestBatchFast } from "./opening-fast.ts";

console.log("pointer compression:", process.config.variables.v8_enable_pointer_compression);
const sizes = [1e9, 2e9, 2 ** 31 - 1, 2 ** 31 + 1, 3e9, 4e9, 1e12];
bench("smallestBatchFast (n is M)", sizes, makeJob, smallestBatchFast, 21);

// The same M = 1e9 records, but the array is made to hold doubles: one fraction is
// pushed and popped, and V8 never changes an array's elements kind back.
const asDoubles = (m: number) => {
  const job = makeJob(m);
  job.records.push(0.5);
  job.records.pop();
  return job;
};
bench("smallestBatchFast, records stored as doubles (n is M)", [1e9, 2e9], asDoubles, smallestBatchFast, 21);
