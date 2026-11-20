// Research only: why does dijkstraHeap grow faster than E log V predicts at 100,000 to 400,000 nodes?
// For each size, 5 runs on fresh inputs, with the garbage-collection pauses inside each timed run,
// on random edges and on "near" edges (each node links to nodes at most 50 numbers away).
// Last, the largest size the heap reaches at 400,000 nodes, for each kind of graph (not timed).
// node --expose-gc dijkstra-growth.ts
import { PerformanceObserver } from "node:perf_hooks";
import { makeGraph, dijkstraHeap, type Graph, type Edge } from "./dijkstra.ts";
import { Heap } from "./heap.ts";

let gcMs = 0;
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) gcMs += e.duration;
}).observe({ entryTypes: ["gc"] });
const gc = (globalThis as { gc?: () => void }).gc;
const tick = () => new Promise((r) => setTimeout(r, 0)); // let the observer deliver its entries

function makeNearGraph(V: number): Graph {
  return Array.from({ length: V }, (_, v) =>
    Array.from({ length: 4 }, (): Edge => {
      const to = Math.min(V - 1, Math.max(0, v + Math.floor(Math.random() * 101) - 50));
      return [to, 1 + Math.floor(Math.random() * 100)];
    }));
}

for (const [label, make] of [["random", makeGraph], ["near", makeNearGraph]] as const) {
  dijkstraHeap(make(50_000), 0); // warm-up
  let prev = 0;
  for (const n of [100_000, 200_000, 400_000]) {
    const total: number[] = [], inGc: number[] = [];
    for (let r = 0; r < 5; r++) {
      const input = make(n);
      gc?.();
      await tick();
      gcMs = 0;
      const start = performance.now();
      dijkstraHeap(input, 0);
      const ms = performance.now() - start;
      await tick();
      total.push(ms);
      inGc.push(gcMs);
    }
    const med = (a: number[]) => [...a].sort((x, y) => x - y)[2];
    const m = med(total);
    console.log(`${label.padEnd(7)} n=${n.toLocaleString("en-US").padStart(8)}  median ${m.toFixed(1).padStart(6)} ms  x prev ${prev ? (m / prev).toFixed(1) : "   "}  gc inside ${med(inGc).toFixed(1).padStart(6)} ms`);
    prev = m;
  }
}

// Count the largest heap size by wrapping push, outside the timed runs.
const push = Heap.prototype.push;
let peak = 0;
Heap.prototype.push = function (this: Heap<unknown>, item: unknown) {
  push.call(this, item);
  if (this.size > peak) peak = this.size;
};
for (const [label, make] of [["random", makeGraph], ["near", makeNearGraph]] as const) {
  peak = 0;
  dijkstraHeap(make(400_000), 0);
  console.log(`${label.padEnd(7)} n= 400,000  largest heap ${peak.toLocaleString("en-US")} entries`);
}
