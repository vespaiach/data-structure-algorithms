// Research only: why findIndex is slow here on Node.js 26. node scan-tier.ts
// Add --trace-opt to see which compiler each function reaches.
import { makeLookups } from "./bounds.ts";

const { times, queries } = makeLookups(100_000);
function viaFindIndex(q: number): number { return times.findIndex((x) => x >= q); }
function viaLoop(q: number): number { let i = 0; while (i < times.length && times[i] < q) i++; return i; }
for (const [name, f] of [["findIndex", viaFindIndex], ["loop", viaLoop]] as const) {
  const ms: string[] = [];
  let sum = 0;
  for (let round = 0; round < 10; round++) {
    const start = performance.now();
    for (const q of queries) sum += f(q);
    ms.push((performance.now() - start).toFixed(0));
  }
  console.log(`${name.padEnd(10)} ms: ${ms.join(" ")}  (check ${sum % 1000})`); // print the sum so the work is used
}
