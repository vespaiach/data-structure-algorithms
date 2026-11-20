// Practice 3: durations[i] is how many seconds job i runs. There are `runners` runners, all free at
// time 0 (runners >= 1). Jobs start in list order, each the moment a runner is free, on the runner
// that is free first. Returns the time the last job finishes (0 for no jobs).
// Up to 200,000 jobs and 10,000 runners. You may import Module 8's heap:
// import { Heap } from "../../module-08/heap.ts";
// Slow: scan every runner for the one free first, for every job. Correct, but O(n * k) time for
// k runners. O(k) memory.
export function lastFinish(durations: number[], runners: number): number {
  const freeAt = new Array<number>(runners).fill(0);
  let last = 0;
  for (const d of durations) {
    let first = 0;
    for (let r = 1; r < runners; r++) if (freeAt[r] < freeAt[first]) first = r;
    freeAt[first] += d;
    last = Math.max(last, freeAt[first]);
  }
  return last;
}
