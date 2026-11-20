// A ring buffer: a power-of-two array whose front moves forward and wraps around.
// push, shift, pop and the peeks are O(1); push doubles the buffer when it is full (amortized O(1)).
export class Deque<T> {
  private buf: (T | undefined)[];
  private head = 0; // index of the front item
  private count = 0;

  constructor(capacity = 16) {
    if (capacity < 1 || (capacity & (capacity - 1)) !== 0) throw new RangeError("capacity must be a power of two");
    this.buf = new Array(capacity);
  }

  get size(): number {
    return this.count;
  }

  // Adds at the back.
  push(item: T): void {
    if (this.count === this.buf.length) this.grow();
    this.buf[(this.head + this.count) & (this.buf.length - 1)] = item;
    this.count++;
  }

  // Removes from the front.
  shift(): T | undefined {
    if (this.count === 0) return undefined;
    const item = this.buf[this.head];
    this.buf[this.head] = undefined; // let the garbage collector free it
    this.head = (this.head + 1) & (this.buf.length - 1);
    this.count--;
    return item;
  }

  // Removes from the back.
  pop(): T | undefined {
    if (this.count === 0) return undefined;
    this.count--;
    const i = (this.head + this.count) & (this.buf.length - 1);
    const item = this.buf[i];
    this.buf[i] = undefined;
    return item;
  }

  peekFront(): T | undefined {
    return this.count === 0 ? undefined : this.buf[this.head];
  }

  peekBack(): T | undefined {
    return this.count === 0 ? undefined : this.buf[(this.head + this.count - 1) & (this.buf.length - 1)];
  }

  // Copies the items in queue order, front first, into an array twice as large.
  private grow(): void {
    const next: (T | undefined)[] = new Array(this.buf.length * 2);
    for (let i = 0; i < this.count; i++) next[i] = this.buf[(this.head + i) & (this.buf.length - 1)];
    this.buf = next;
    this.head = 0;
  }
}
