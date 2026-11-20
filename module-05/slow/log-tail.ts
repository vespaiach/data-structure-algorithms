// A correct answer to Exercise 3 that uses push() and shift(), to show that the timing test catches it.
export class LogTail {
  private lines: string[] = [];
  private capacity: number;

  constructor(capacity: number) {
    if (capacity < 1) throw new RangeError("capacity must be at least 1");
    this.capacity = capacity;
  }

  get size(): number {
    return this.lines.length;
  }

  push(line: string): void {
    this.lines.push(line);
    if (this.lines.length > this.capacity) this.lines.shift();
  }

  toArray(): string[] {
    return [...this.lines];
  }
}
