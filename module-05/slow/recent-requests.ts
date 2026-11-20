// A correct answer to Exercise 2 that uses shift(), to show that the timing test catches it.
export class RecentRequests {
  private times: number[] = [];
  private windowMs: number;

  constructor(windowMs: number) {
    this.windowMs = windowMs;
  }

  hit(t: number): number {
    this.times.push(t);
    while (this.times[0] <= t - this.windowMs) this.times.shift();
    return this.times.length;
  }
}
