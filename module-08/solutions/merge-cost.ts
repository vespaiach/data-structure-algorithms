// Exercise 1: log files of the given sizes are merged two at a time until one file is left.
// Merging files of a and b MB costs a + b. Always merge the two smallest files.
// Returns the total cost. The input array is not changed.
// A min-heap built bottom-up from a copy; each round pops two and pushes their sum.
// O(n log n) time, O(n) memory.
import { Heap } from "../heap.ts";

export function mergeCost(sizes: number[]): number {
  const files = new Heap<number>((a, b) => a < b, sizes.slice()); // O(n) build from a copy
  let total = 0;
  while (files.size > 1) {
    const merged = files.pop()! + files.pop()!;
    total += merged;
    files.push(merged);
  }
  return total;
}
