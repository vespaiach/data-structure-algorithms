// Scratch check of the "mixed" workload in lru-bench.ts: hits, evictions and distinct keys (Map-only LRU).
// The first version drew keys with an LCG, `seed % (2 * cap)`, and found 297 to 762 distinct keys and no evictions.
for (const cap of [1000, 4000, 16000]) {
  const m = new Map<number, number>();
  let hits = 0, evictions = 0;
  const distinct = new Set<number>();
  for (let i = 0; i < 200000; i++) {
    const k = Math.floor(Math.random() * 2 * cap);
    distinct.add(k);
    if (m.has(k)) { hits++; const v = m.get(k)!; m.delete(k); m.set(k, v); }
    else { if (m.size === cap) { m.delete(m.keys().next().value!); evictions++; } m.set(k, i); }
  }
  console.log(cap, "hits", hits, "evictions", evictions, "distinct keys", distinct.size);
}
