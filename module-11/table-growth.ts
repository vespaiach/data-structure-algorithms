// Research only: why waysTable grows faster than 10x from 1,000,000 to 10,000,000 steps.
// Times one call per size in this order, with and without a forced GC before it, and a
// Float64Array table for comparison: node --expose-gc table-growth.ts
import { PerformanceObserver } from "node:perf_hooks";
import { waysTable } from "./opening-fast.ts";

function waysFloat64(n: number): number {
  const table = new Float64Array(n + 1);
  table[0] = 1;
  table[1] = 1;
  for (let i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2];
  return table[n];
}

let gcMs = 0;
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) gcMs += e.duration;
}).observe({ entryTypes: ["gc"] });

const gc = (globalThis as { gc?: () => void }).gc;
let sink = 0;
for (const [name, fn] of [["waysTable", waysTable], ["waysFloat64", waysFloat64]] as const) {
  for (const n of [1_000_000, 10_000_000]) {
    const times: number[] = [];
    const gcs: number[] = [];
    for (let r = 0; r < 6; r++) {
      gc?.();
      await new Promise((resolve) => setTimeout(resolve, 0)); // let the observer report the forced GC
      gcMs = 0;
      const start = performance.now();
      sink += fn(n);
      times.push(performance.now() - start);
      await new Promise((resolve) => setTimeout(resolve, 0));
      gcs.push(gcMs);
    }
    times.sort((a, b) => a - b);
    gcs.sort((a, b) => a - b);
    console.log(`${name.padEnd(12)} n = ${n.toLocaleString("en-US").padStart(10)}: median ${times[3].toFixed(2)} ms, GC during the call ${gcs[3].toFixed(2)} ms`);
  }
}
if (sink === 0) console.log(sink);
