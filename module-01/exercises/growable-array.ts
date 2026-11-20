// A list on top of fixed-size storage, like the backing store of a JavaScript array.
// When the storage is full, push() allocates storage twice as large and copies every item.
// `copies` counts the items copied so far.
export class GrowableArray<T> {
  copies = 0;

  get length(): number {
    throw new Error("not implemented");
  }

  get capacity(): number {
    throw new Error("not implemented");
  }

  push(item: T): void {
    throw new Error("not implemented");
  }

  get(index: number): T {
    throw new Error("not implemented");
  }
}
