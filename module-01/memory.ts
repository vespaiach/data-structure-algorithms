// How much heap one million numbers take in an array, a Set and a Map.
// Run with: node --expose-gc memory.ts
const gc = (globalThis as { gc?: () => void }).gc;
if (!gc) throw new Error("run with node --expose-gc");

function heapMB(make: () => unknown): string {
  gc();
  const before = process.memoryUsage().heapUsed;
  const kept = make();
  gc();
  const after = process.memoryUsage().heapUsed;
  if (!kept) throw new Error("unreachable"); // keeps `kept` alive until here
  return ((after - before) / 1024 / 1024).toFixed(1) + " MB";
}

const n = 1_000_000;
const ids = Array.from({ length: n }, (_, i) => i);
console.log("array of 1,000,000 small integers ", heapMB(() => Array.from({ length: n }, (_, i) => i)));
console.log("array of 1,000,000 doubles        ", heapMB(() => Array.from({ length: n }, (_, i) => i + 0.5)));
console.log("Set of 1,000,000 small integers   ", heapMB(() => new Set(ids)));
console.log("Map of 1,000,000 small integers   ", heapMB(() => new Map(ids.map((i) => [i, i]))));
