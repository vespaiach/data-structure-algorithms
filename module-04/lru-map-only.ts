// The shortcut: a Map alone is an LRU cache, because a Map iterates in insertion order.
// delete + set moves a key to the end; the first key is the least recently used.
export class LruMap<K, V> {
  private map = new Map<K, V>();
  private capacity: number;
  constructor(capacity: number) {
    this.capacity = capacity;
  }
  get size(): number {
    return this.map.size;
  }
  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  put(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size === this.capacity) this.map.delete(this.map.keys().next().value!);
    this.map.set(key, value);
  }
  keys(): K[] {
    return [...this.map.keys()].reverse();
  }
}
