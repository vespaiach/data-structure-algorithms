// A common bug: restarting `right` at `left` for every window. Same answer, quadratic time.
// node pointer-back.ts
import { bench } from "./bench.ts";
import { busiestWindow, SECONDS, type Busiest } from "./busiest.ts";

function busiestRestart(times: number[]): Busiest {
  let best: Busiest = { start: 0, count: 0 };
  for (let left = 0; left < times.length; left++) {
    let right = left; // the bug: right moves back to left on every pass
    while (right < times.length && times[right] < times[left] + 60) right++;
    if (right - left > best.count) best = { start: times[left], count: right - left };
  }
  return best;
}

const log = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * SECONDS)).sort((a, b) => a - b);

bench("right restarts at left each time", [100_000, 1_000_000, 4_000_000], log, busiestRestart);
bench("busiestWindow", [100_000, 1_000_000, 4_000_000], log, busiestWindow);
