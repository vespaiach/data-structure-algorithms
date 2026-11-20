// A small hash set of strings, laid out like V8's ordered hash table.
// `buckets[b]` is the index of the newest entry in bucket b, or -1 for none.
// `keys` holds the entries in insertion order; `chain[i]` is the next entry in i's bucket.
// has, add and delete: O(1) on average, O(n) when every key lands in one bucket.

// A toy hash function: the same string always gives the same number.
export function toyHash(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

export class ToyHashSet {
  buckets: number[] = [-1, -1];
  keys: (string | undefined)[] = []; // undefined marks a deleted entry
  chain: number[] = [];
  size = 0;

  bucketOf(key: string): number {
    return toyHash(key) & (this.buckets.length - 1); // the bucket count is a power of 2
  }

  indexOf(key: string): number {
    for (let i = this.buckets[this.bucketOf(key)]; i !== -1; i = this.chain[i]) {
      if (this.keys[i] === key) return i;
    }
    return -1;
  }

  has(key: string): boolean {
    return this.indexOf(key) !== -1;
  }

  add(key: string): this {
    if (this.has(key)) return this;
    // Load factor 2, as in V8: room for 2 entries per bucket, holes included.
    if (this.keys.length === 2 * this.buckets.length) this.rehash(2 * this.buckets.length);
    const b = this.bucketOf(key);
    this.keys.push(key);
    this.chain.push(this.buckets[b]); // the new entry points to the old head of its bucket
    this.buckets[b] = this.keys.length - 1;
    this.size++;
    return this;
  }

  delete(key: string): boolean {
    const i = this.indexOf(key);
    if (i === -1) return false;
    this.keys[i] = undefined; // keep the slot; the next rehash drops it
    this.size--;
    return true;
  }

  // Build a new table with `bucketCount` buckets and add the live keys again, in order.
  rehash(bucketCount: number): void {
    const live = this.keys.filter((k) => k !== undefined);
    this.buckets = new Array<number>(bucketCount).fill(-1);
    this.keys = [];
    this.chain = [];
    this.size = 0;
    for (const key of live) this.add(key);
  }

  *[Symbol.iterator](): Generator<string> {
    for (const key of this.keys) if (key !== undefined) yield key;
  }
}
