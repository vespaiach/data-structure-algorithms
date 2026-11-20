// A binary heap stored in an array. `before(a, b)` returns true when a must
// come out before b: (a, b) => a < b gives a min-heap, (a, b) => a > b a max-heap.
// Index math, 0-based: parent of i is (i - 1) >> 1, children are 2i + 1 and 2i + 2.
// Later modules import this file.
export class Heap<T> {
  private items: T[];
  private before: (a: T, b: T) => boolean;

  // Builds a heap from `items` in O(n): sift down every parent, from the last
  // one to the root. The array is used in place, not copied.
  constructor(before: (a: T, b: T) => boolean, items: T[] = []) {
    this.before = before;
    this.items = items;
    for (let i = (items.length >> 1) - 1; i >= 0; i--) this.siftDown(i);
  }

  get size(): number {
    return this.items.length;
  }

  // The item that comes out next. O(1).
  peek(): T | undefined {
    return this.items[0];
  }

  // O(log n): the new item climbs at most the height of the tree.
  push(item: T): void {
    this.items.push(item);
    this.siftUp(this.items.length - 1);
  }

  // O(log n): the last item moves to the root and sinks.
  pop(): T | undefined {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0];
    const last = items.pop()!;
    if (items.length > 0) {
      items[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  // Swap out the top for `item` in one sift: cheaper than pop() then push().
  replaceTop(item: T): T | undefined {
    const top = this.items[0];
    this.items[0] = item;
    this.siftDown(0);
    return top;
  }

  private siftUp(i: number): void {
    const items = this.items;
    const item = items[i];
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.before(item, items[parent])) break;
      items[i] = items[parent]; // move the parent down; place `item` once at the end
      i = parent;
    }
    items[i] = item;
  }

  private siftDown(i: number): void {
    const items = this.items;
    const n = items.length;
    const item = items[i];
    while (true) {
      let child = 2 * i + 1;
      if (child >= n) break;
      if (child + 1 < n && this.before(items[child + 1], items[child])) child++;
      if (!this.before(items[child], item)) break;
      items[i] = items[child];
      i = child;
    }
    items[i] = item;
  }
}
