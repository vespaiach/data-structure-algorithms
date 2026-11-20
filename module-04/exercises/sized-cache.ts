// Exercise 4: a cache of response bodies, limited by their total size instead of their count.
// put(key, value, size) stores the entry as the most recently used, then evicts least recently
// used entries until the total size is at most maxSize. An entry larger than maxSize is not
// stored, and an older entry under the same key is removed. get makes a key the most recently used.
// Target: O(1) per get, amortized O(1) per put.
export class SizedCache<K, V> {
  constructor(maxSize: number) {
    throw new Error("not implemented");
  }
  get totalSize(): number {
    throw new Error("not implemented");
  }
  get(key: K): V | undefined {
    throw new Error("not implemented");
  }
  put(key: K, value: V, size: number): void {
    throw new Error("not implemented");
  }
  // Keys from most to least recently used.
  keys(): K[] {
    throw new Error("not implemented");
  }
}
