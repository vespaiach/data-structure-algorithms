// An LRU cache from a Map and a doubly linked list. get and put are O(1) on average.
// Memory per cached key: one Map entry and one node object (see memory.ts).
type Node<K, V> = { key: K; value: V; prev: Node<K, V> | null; next: Node<K, V> | null };

export class LruCache<K, V> {
  private map = new Map<K, Node<K, V>>();
  private head: Node<K, V> | null = null; // most recently used
  private tail: Node<K, V> | null = null; // least recently used
  private capacity: number;

  constructor(capacity: number) {
    if (capacity < 1) throw new RangeError("capacity must be at least 1");
    this.capacity = capacity;
  }

  get size(): number {
    return this.map.size;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (node === undefined) return undefined;
    this.unlink(node);
    this.pushFront(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const old = this.map.get(key);
    if (old !== undefined) {
      old.value = value;
      this.unlink(old);
      this.pushFront(old);
      return;
    }
    if (this.map.size === this.capacity) {
      const lru = this.tail!;
      this.unlink(lru);
      this.map.delete(lru.key);
    }
    const node: Node<K, V> = { key, value, prev: null, next: null };
    this.pushFront(node);
    this.map.set(key, node);
  }

  // Keys from most to least recently used, for tests.
  keys(): K[] {
    const out: K[] = [];
    for (let n = this.head; n !== null; n = n.next) out.push(n.key);
    return out;
  }

  private unlink(node: Node<K, V>): void {
    if (node.prev !== null) node.prev.next = node.next;
    else this.head = node.next;
    if (node.next !== null) node.next.prev = node.prev;
    else this.tail = node.prev;
    node.prev = node.next = null;
  }

  private pushFront(node: Node<K, V>): void {
    node.next = this.head;
    if (this.head !== null) this.head.prev = node;
    this.head = node;
    if (this.tail === null) this.tail = node;
  }
}
