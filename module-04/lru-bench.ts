// 200,000 operations on an LRU cache of several capacities, Map + list against Map only.
import { bench } from "./bench.ts";
import { LruCache } from "./lru-cache.ts";
import { LruMap } from "./lru-map-only.ts";

const OPS = 200_000;
type Cache = { get(k: number): number | undefined; put(k: number, v: number): void };

// Every put is a new key, so every put past the capacity evicts.
function allMisses(c: Cache): void {
  for (let i = 0; i < OPS; i++) c.put(i, i);
}
// Random keys from 2 x capacity: about half the gets miss, and each miss puts and evicts.
function mixed(c: Cache & { cap: number }): void {
  for (let i = 0; i < OPS; i++) {
    const k = Math.floor(Math.random() * 2 * c.cap);
    if (c.get(k) === undefined) c.put(k, i);
  }
}
const caps = [1_000, 4_000, 16_000];
const list = (cap: number) => Object.assign(new LruCache<number, number>(cap), { cap });
const mapOnly = (cap: number) => Object.assign(new LruMap<number, number>(cap), { cap });
bench("all misses, Map + linked list (n = capacity)", caps, list, allMisses);
bench("all misses, Map only", caps, mapOnly, allMisses);
bench("mixed, Map + linked list", caps, list, mixed);
bench("mixed, Map only", caps, mapOnly, mixed);
