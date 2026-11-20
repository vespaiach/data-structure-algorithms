import { Deque } from "./deque.ts";

// The largest value in every window of k consecutive samples.
// A deque of indexes whose values decrease from front to back: O(n) time (each index is pushed
// once and removed at most once), O(k) memory.
export function windowMax(samples: number[], k: number): number[] {
  if (k < 1) throw new RangeError("k must be at least 1");
  const out: number[] = [];
  const dq = new Deque<number>(); // indexes; their values decrease from front to back
  for (let i = 0; i < samples.length; i++) {
    while (dq.size > 0 && samples[dq.peekBack()!] <= samples[i]) dq.pop();
    dq.push(i);
    if (dq.peekFront()! <= i - k) dq.shift(); // the front index left the window
    if (i >= k - 1) out.push(samples[dq.peekFront()!]);
  }
  return out;
}
