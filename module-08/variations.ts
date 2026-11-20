// Two more shapes of the heap pattern: node variations.ts
import { bench } from "./bench.ts";
import { Heap } from "./heap.ts";

// The median of every value added so far. `low` is a max-heap with the smaller half,
// `high` a min-heap with the larger half, and low holds the same count as high or one more.
// add: O(log n). median: O(1). O(n) memory.
export class RunningMedian {
  private low = new Heap<number>((a, b) => a > b);
  private high = new Heap<number>((a, b) => a < b);

  add(x: number): void {
    if (this.low.size === 0 || x <= this.low.peek()!) this.low.push(x);
    else this.high.push(x);
    // Move one value across so that low.size is high.size or high.size + 1.
    if (this.low.size > this.high.size + 1) this.high.push(this.low.pop()!);
    else if (this.high.size > this.low.size) this.low.push(this.high.pop()!);
  }

  median(): number | undefined {
    if (this.low.size === 0) return undefined;
    if (this.low.size > this.high.size) return this.low.peek();
    return (this.low.peek()! + this.high.peek()!) / 2;
  }
}

// The same answer from a sorted array: find the place with a scan, insert with splice.
// O(n) per value, so O(n^2) for n values.
export function lastMedianSorted(xs: number[]): number | undefined {
  const sorted: number[] = [];
  let median: number | undefined;
  for (const x of xs) {
    let i = 0;
    while (i < sorted.length && sorted[i] < x) i++;
    sorted.splice(i, 0, x);
    const m = sorted.length >> 1;
    median = sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
  }
  return median;
}

export function lastMedianHeaps(xs: number[]): number | undefined {
  const rm = new RunningMedian();
  for (const x of xs) rm.add(x);
  return rm.median();
}

// Merge k sorted lists into one sorted list. The heap holds one entry per list:
// [value, list index, position]. O(N log k) time for N values in all, O(k) extra memory.
export function mergeSorted(lists: number[][]): number[] {
  const heap = new Heap<[number, number, number]>((a, b) => a[0] < b[0]);
  lists.forEach((list, i) => { if (list.length > 0) heap.push([list[0], i, 0]); });
  const out: number[] = [];
  while (heap.size > 0) {
    const [value, i, pos] = heap.peek()!;
    out.push(value);
    if (pos + 1 < lists[i].length) heap.replaceTop([lists[i][pos + 1], i, pos + 1]); // the next value of the same list
    else heap.pop(); // that list is used up
  }
  return out;
}

if (process.argv[1] === import.meta.filename) {
  const rm = new RunningMedian();
  const medians: (number | undefined)[] = [];
  for (const x of [5, 15, 1, 3, 8]) { rm.add(x); medians.push(rm.median()); }
  console.log("medians after 5 15 1 3 8:", medians.join(" "));
  console.log("merged:", mergeSorted([[1, 4, 9], [2, 3, 10], [5]]).join(" "));

  const values = (n: number) => Array.from({ length: n }, () => Math.random());
  const xs = values(5_001);
  console.log("same median:", lastMedianSorted(xs) === lastMedianHeaps(xs));
  bench("lastMedianSorted, small", [1_000, 4_000, 16_000], values, lastMedianSorted);
  bench("lastMedianHeaps, small", [1_000, 4_000, 16_000], values, lastMedianHeaps);
  bench("lastMedianSorted", [25_000, 50_000, 100_000], values, lastMedianSorted);
  bench("lastMedianHeaps", [25_000, 50_000, 100_000], values, lastMedianHeaps);
}
