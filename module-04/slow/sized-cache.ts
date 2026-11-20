// A Map-only answer to Exercise 4: correct, but each eviction takes the first key from a fresh
// keys() iterator, which steps over every entry deleted since V8 last rebuilt the table.
export class SizedCache<K, V> {
  private map = new Map<K, { value: V; size: number }>();
  private maxSize: number;
  private total = 0;
  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }
  get totalSize(): number {
    return this.total;
  }
  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (entry === undefined) return undefined;
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }
  put(key: K, value: V, size: number): void {
    const old = this.map.get(key);
    if (old !== undefined) {
      this.map.delete(key);
      this.total -= old.size;
    }
    if (size > this.maxSize) return;
    this.map.set(key, { value, size });
    this.total += size;
    while (this.total > this.maxSize) {
      const lru = this.map.keys().next().value!;
      this.total -= this.map.get(lru)!.size;
      this.map.delete(lru);
    }
  }
  keys(): K[] {
    return [...this.map.keys()].reverse();
  }
}
