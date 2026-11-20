// Practice 3: durations[i] is how many seconds job i runs. There are `runners` runners, all free at
// time 0 (runners >= 1). Jobs start in list order, each the moment a runner is free, on the runner
// that is free first. Returns the time the last job finishes (0 for no jobs).
// Up to 200,000 jobs and 10,000 runners. You may import Module 8's heap:
// import { Heap } from "../../module-08/heap.ts";
// Pattern: a min-heap (Module 8) of the times the runners are free. Each job takes the top, the
// runner free first, and puts it back with its new free time. O(k + n log k) time for k runners
// (the build is O(k)), O(k) memory.
import { Heap } from "../../module-08/heap.ts";

export function lastFinish(durations: number[], runners: number): number {
  const freeAt = new Heap<number>((a, b) => a < b, new Array<number>(runners).fill(0));
  let last = 0;
  for (const d of durations) {
    const end = freeAt.peek()! + d;
    freeAt.replaceTop(end); // the runner free first takes the job
    if (end > last) last = end;
  }
  return last;
}
