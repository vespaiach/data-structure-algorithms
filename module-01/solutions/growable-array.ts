// A list on top of fixed-size storage, like the backing store of a JavaScript array.
// When the storage is full, push() allocates storage twice as large and copies every item.
// One push costs O(n) when it grows, but n pushes copy fewer than 2n items in total:
// amortized O(1) per push. Memory: at most 2n slots.
export class GrowableArray<T> {
  copies = 0;
  #items: (T | undefined)[] = new Array(1);
  #length = 0;

  get length(): number {
    return this.#length;
  }

  get capacity(): number {
    return this.#items.length;
  }

  push(item: T): void {
    if (this.#length === this.#items.length) {
      const bigger: (T | undefined)[] = new Array(this.#items.length * 2);
      for (let i = 0; i < this.#length; i++) {
        bigger[i] = this.#items[i];
        this.copies++;
      }
      this.#items = bigger;
    }
    this.#items[this.#length++] = item;
  }

  get(index: number): T {
    if (index < 0 || index >= this.#length) throw new RangeError(`index ${index} out of range`);
    return this.#items[index] as T;
  }
}
