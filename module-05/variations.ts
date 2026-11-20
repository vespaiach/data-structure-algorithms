// Two more shapes of the monotonic stack and deque: node variations.ts
import { Deque } from "./deque.ts";

// For each item, the index of the last earlier item that is larger, or -1.
// The same stack as nextSlower, but the answer is read from the top after popping.
// O(n) time, O(n) memory.
export function previousLarger(values: number[]): number[] {
  const result: number[] = [];
  const stack: number[] = []; // indexes; their values decrease from bottom to top
  for (let i = 0; i < values.length; i++) {
    while (stack.length > 0 && values[stack[stack.length - 1]] <= values[i]) stack.pop();
    result.push(stack.length === 0 ? -1 : stack[stack.length - 1]);
    stack.push(i);
  }
  return result;
}

// The smallest value in every window of k consecutive samples: windowMax with the comparison flipped.
// O(n) time, O(k) memory.
export function windowMin(samples: number[], k: number): number[] {
  if (k < 1) throw new RangeError("k must be at least 1");
  const out: number[] = [];
  const dq = new Deque<number>(); // indexes; their values increase from front to back
  for (let i = 0; i < samples.length; i++) {
    while (dq.size > 0 && samples[dq.peekBack()!] >= samples[i]) dq.pop();
    dq.push(i);
    if (dq.peekFront()! <= i - k) dq.shift();
    if (i >= k - 1) out.push(samples[dq.peekFront()!]);
  }
  return out;
}

if (process.argv[1] === import.meta.filename) {
  console.log("previousLarger([50, 30, 40, 60, 20]):", previousLarger([50, 30, 40, 60, 20]));
  console.log("windowMin([30, 10, 50, 20, 20, 40, 10], 3):", windowMin([30, 10, 50, 20, 20, 40, 10], 3));
}
