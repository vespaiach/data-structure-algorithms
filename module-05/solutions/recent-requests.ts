// Exercise 2: hit(t) records a request at time t (times never decrease) and returns
// how many requests fall in the last windowMs milliseconds: times in (t - windowMs, t].
// Each hit must be amortized O(1). Do not use shift().
// A queue of times with a head index: each time enters once and leaves once, so hit() is
// amortized O(1). Memory: O(w) for w requests in the window, up to about 2w before compaction.
export class RecentRequests {
  private times: number[] = [];
  private head = 0; // index of the oldest time still in the window
  private windowMs: number;

  constructor(windowMs: number) {
    this.windowMs = windowMs;
  }

  hit(t: number): number {
    this.times.push(t);
    while (this.times[this.head] <= t - this.windowMs) this.head++;
    if (this.head > 1024 && this.head * 2 > this.times.length) {
      this.times = this.times.slice(this.head);
      this.head = 0;
    }
    return this.times.length - this.head;
  }
}
