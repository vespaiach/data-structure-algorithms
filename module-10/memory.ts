// Heap held by the full list of subsets: node --expose-gc memory.ts
import { subsets } from "./shapes.ts";

const gc = (globalThis as { gc?: () => void }).gc;
if (!gc) throw new Error("run with: node --expose-gc memory.ts");

for (const n of [16, 18, 20]) {
  const xs = Array.from({ length: n }, (_, i) => i);
  gc();
  const before = process.memoryUsage().heapUsed;
  const out = subsets(xs);
  gc();
  const after = process.memoryUsage().heapUsed;
  const mb = (after - before) / 1024 / 1024;
  console.log(`n = ${n}: ${out.length.toLocaleString("en-US")} subsets hold ${mb.toFixed(1)} MB, ${((after - before) / out.length).toFixed(1)} bytes per subset`);
}
