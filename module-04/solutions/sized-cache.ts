// Exercise 4: a cache of response bodies, limited by their total size instead of their count.
// put(key, value, size) stores the entry as the most recently used, then evicts least recently
// used entries until the total size is at most maxSize. An entry larger than maxSize is not
// stored, and an older entry under the same key is removed. get makes a key the most recently used.
// A Map from key to node, and a doubly linked list from most to least recently used.
// get: O(1). put: O(1) plus one step per evicted entry; each entry is evicted at most once,
// so amortized O(1). Memory: O(number of entries).
type Node<K, V> = { key: K; value: V; size: number; prev: Node<K, V> | null; next: Node<K, V> | null };

export class SizedCache<K, V> {
  private map = new Map<K, Node<K, V>>();
  private head: Node<K, V> | null = null; // most recently used
  private tail: Node<K, V> | null = null; // least recently used
  private maxSize: number;
  private total = 0;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get totalSize(): number {
    return this.total;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (node === undefined) return undefined;
    this.unlink(node);
    this.pushFront(node);
    return node.value;
  }

  put(key: K, value: V, size: number): void {
    const old = this.map.get(key);
    if (old !== undefined) this.remove(old);
    if (size > this.maxSize) return;
    const node: Node<K, V> = { key, value, size, prev: null, next: null };
    this.pushFront(node);
    this.map.set(key, node);
    this.total += size;
    while (this.total > this.maxSize) this.remove(this.tail!);
  }

  keys(): K[] {
    const out: K[] = [];
    for (let n = this.head; n !== null; n = n.next) out.push(n.key);
    return out;
  }

  private remove(node: Node<K, V>): void {
    this.unlink(node);
    this.map.delete(node.key);
    this.total -= node.size;
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
