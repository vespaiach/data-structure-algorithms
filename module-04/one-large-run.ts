// The opening numbers: one run of each function on 500,000 tasks. node one-large-run.ts
// Each input is built right before its function runs, as bench.ts does, and is not timed.
import { makeTasks, removeDone, drainFront } from "./opening-slow.ts";
import { removeDoneList, drainList } from "./opening-fast.ts";
import { fromArray } from "./list.ts";

const N = 500_000;
function time<T>(label: string, input: T, fn: (input: T) => unknown): void {
  const start = performance.now();
  fn(input);
  console.log(label.padEnd(26) + ((performance.now() - start) / 1000).toFixed(3).padStart(8) + " s");
}
time("removeDone with splice", makeTasks(N), removeDone);
time("drainFront with shift", makeTasks(N), drainFront);
time("removeDone on a list", fromArray(makeTasks(N)), removeDoneList);
time("drainFront on a list", fromArray(makeTasks(N)), drainList);
