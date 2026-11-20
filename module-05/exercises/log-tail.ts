// Exercise 3: keep the last `capacity` log lines. When it is full, push overwrites the oldest line.
// toArray() returns the lines oldest first. Throw a RangeError when capacity < 1.
// Target: push O(1), toArray O(capacity), memory O(capacity).
export class LogTail {
  constructor(capacity: number) {
    throw new Error("not implemented");
  }
  get size(): number {
    throw new Error("not implemented");
  }
  push(line: string): void {
    throw new Error("not implemented");
  }
  toArray(): string[] {
    throw new Error("not implemented");
  }
}
