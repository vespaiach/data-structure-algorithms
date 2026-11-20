// Exercise 5: the length of the longest run of consecutive samples whose largest and smallest
// values differ by at most `limit`. Return 0 for no samples.
// A window that grows and shrinks (Module 2), with two monotonic deques of indexes:
// one for the window's maximum, one for its minimum. Each index enters and leaves each deque
// at most once, and `left` only moves forward: O(n) time, O(n) memory in the worst case.
import { Deque } from "../deque.ts";

export function longestSteady(samples: number[], limit: number): number {
  const maxQ = new Deque<number>(); // values decrease from front to back
  const minQ = new Deque<number>(); // values increase from front to back
  let left = 0;
  let best = 0;
  for (let right = 0; right < samples.length; right++) {
    const v = samples[right];
    while (maxQ.size > 0 && samples[maxQ.peekBack()!] <= v) maxQ.pop();
    maxQ.push(right);
    while (minQ.size > 0 && samples[minQ.peekBack()!] >= v) minQ.pop();
    minQ.push(right);
    // Shrink from the left until the window is steady again.
    while (samples[maxQ.peekFront()!] - samples[minQ.peekFront()!] > limit) {
      left++;
      if (maxQ.peekFront()! < left) maxQ.shift();
      if (minQ.peekFront()! < left) minQ.shift();
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
