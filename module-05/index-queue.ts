// A queue on an array with a head index. push and shift are amortized O(1).
export class IndexQueue<T> {
  private items: (T | undefined)[] = [];
  private head = 0; // index of the front item

  get size(): number {
    return this.items.length - this.head;
  }

  push(item: T): void {
    this.items.push(item);
  }

  shift(): T | undefined {
    if (this.head === this.items.length) return undefined;
    const item = this.items[this.head];
    this.items[this.head] = undefined; // let the garbage collector free the job
    this.head++;
    // Once the used front is over half the array, copy the rest to a new array:
    // O(n), but at most once per n shifts.
    if (this.head > 1024 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return item;
  }
}
