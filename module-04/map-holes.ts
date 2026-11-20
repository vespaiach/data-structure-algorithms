// Map-only LRU, every put evicts: ns per put. A fresh keys() iterator scans the deleted
// entries left at the front of V8's table; one long-lived iterator does not. 200k ops each.
function run(cap: number, ops: number, useIter: boolean): string {
  const m = new Map<number, number>(); let it: Iterator<number> | null = null;
  for (let i = 0; i < cap; i++) m.set(i, i);
  if (useIter) it = m.keys();
  const s = performance.now();
  for (let i = cap; i < cap + ops; i++) {
    m.delete(useIter ? it!.next().value : m.keys().next().value!);
    m.set(i, i);
  }
  return ((performance.now() - s) * 1e6 / ops).toFixed(0);
}
for (const cap of [1000, 1024, 1500, 2000, 4000, 8000, 8193, 10000, 16000, 16383]) {
  run(cap, 20000, false);
  console.log(String(cap).padStart(6), "fresh iterator:", run(cap, 200000, false).padStart(7), "ns/op   one long-lived iterator:", run(cap, 200000, true).padStart(4), "ns/op");
}
