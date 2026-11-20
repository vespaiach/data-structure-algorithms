// Exercise 3: keep the last `capacity` log lines. When it is full, push overwrites the oldest line.
// toArray() returns the lines oldest first. Throw a RangeError when capacity < 1.
// A ring buffer of fixed size: push O(1), toArray O(capacity), memory O(capacity).
export class LogTail {
  private lines: string[];
  private head = 0; // index of the oldest line
  private count = 0;

  constructor(capacity: number) {
    if (capacity < 1) throw new RangeError("capacity must be at least 1");
    this.lines = new Array(capacity);
  }

  get size(): number {
    return this.count;
  }

  push(line: string): void {
    const cap = this.lines.length;
    if (this.count < cap) {
      this.lines[(this.head + this.count) % cap] = line;
      this.count++;
    } else {
      this.lines[this.head] = line; // overwrite the oldest, which is now the newest
      this.head = (this.head + 1) % cap;
    }
  }

  toArray(): string[] {
    const out: string[] = [];
    for (let i = 0; i < this.count; i++) out.push(this.lines[(this.head + i) % this.lines.length]);
    return out;
  }
}
