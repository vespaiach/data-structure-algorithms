// Bytes per element: an array of numbers, a linked list of {value, next}, a doubly linked list,
// a Map entry, and the node of an LRU cache.
// Run with: node --expose-gc memory.ts
const N = 1_000_000;
const gc = (globalThis as any).gc as () => void;

function bytesPer(build: () => unknown): number {
  gc();
  const before = process.memoryUsage().heapUsed;
  const kept = build();
  gc();
  const after = process.memoryUsage().heapUsed;
  if (kept === null) console.log("unreachable"); // keeps `kept` alive until here
  return (after - before) / N;
}

class DNode { value: number; prev: DNode | null = null; next: DNode | null = null; constructor(v: number) { this.value = v; } }

console.log("array of small integers:", bytesPer(() => Array.from({ length: N }, (_, i) => i)).toFixed(1));
console.log("singly linked {value, next}:", bytesPer(() => {
  let head: { value: number; next: unknown } | null = null;
  for (let i = 0; i < N; i++) head = { value: i, next: head };
  return head;
}).toFixed(1));
console.log("doubly linked class DNode:", bytesPer(() => {
  let head: DNode | null = null;
  for (let i = 0; i < N; i++) { const n = new DNode(i); n.next = head; if (head) head.prev = n; head = n; }
  return head;
}).toFixed(1));
console.log("Map<number, number> entries:", bytesPer(() => { const m = new Map<number, number>(); for (let i = 0; i < N; i++) m.set(i, i); return m; }).toFixed(1));
console.log("LRU node {key, value, prev, next}:", bytesPer(() => {
  let head: { key: number; value: number; prev: unknown; next: unknown } | null = null;
  for (let i = 0; i < N; i++) head = { key: i, value: i, prev: null, next: head };
  return head;
}).toFixed(1));
