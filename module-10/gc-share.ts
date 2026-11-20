// Research only: how much of one subsets(20) call is garbage collection: node gc-share.ts
import { PerformanceObserver } from "node:perf_hooks";
import { subsets } from "./shapes.ts";

let gcMs = 0;
const obs = new PerformanceObserver((list) => { for (const e of list.getEntries()) gcMs += e.duration; });
obs.observe({ entryTypes: ["gc"] });

for (const n of [16, 18, 20]) {
  const xs = Array.from({ length: n }, (_, i) => i);
  subsets(xs); // warm-up
  await new Promise((r) => setTimeout(r, 50));
  gcMs = 0;
  const start = performance.now();
  const out = subsets(xs);
  const ms = performance.now() - start;
  await new Promise((r) => setTimeout(r, 50)); // let the observer report
  console.log(`n = ${n}: ${ms.toFixed(1)} ms in all, ${gcMs.toFixed(1)} ms of it in GC (${out.length} subsets)`);
}
obs.disconnect();
