// Research only: why does buildOrderKahn grow faster than 2x per doubling at large sizes?
// For each size, time 5 runs on fresh inputs and add up the garbage-collection pauses inside each timed run.
// node --expose-gc kahn-growth.ts      (a gc() runs before each timed run, so the input is not young)
import { PerformanceObserver } from "node:perf_hooks";
import { makePackages } from "./packages.ts";
import { buildOrderKahn } from "./opening-fast.ts";

let gcMs = 0;
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) gcMs += e.duration;
}).observe({ entryTypes: ["gc"] });
const gc = (globalThis as { gc?: () => void }).gc;
const tick = () => new Promise((r) => setTimeout(r, 0)); // let the observer deliver its entries

buildOrderKahn(makePackages(50_000)); // warm-up
for (const n of [50_000, 100_000, 200_000, 400_000]) {
  const total: number[] = [], inGc: number[] = [];
  for (let r = 0; r < 5; r++) {
    const input = makePackages(n);
    gc?.();
    await tick();
    gcMs = 0;
    const start = performance.now();
    buildOrderKahn(input);
    const ms = performance.now() - start;
    await tick();
    total.push(ms);
    inGc.push(gcMs);
  }
  const med = (a: number[]) => [...a].sort((x, y) => x - y)[2];
  console.log(`n=${n.toLocaleString("en-US").padStart(8)}  median ${med(total).toFixed(1).padStart(7)} ms  gc inside ${med(inGc).toFixed(1).padStart(7)} ms  without gc ${med(total.map((t, i) => t - inGc[i])).toFixed(1).padStart(7)} ms`);
}
