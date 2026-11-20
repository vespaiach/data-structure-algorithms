// Common mistakes with top k and heaps, and the wrong output each one gives: node mistakes.ts
import { Heap } from "./heap.ts";

const scores = [5, 100, 25, 1000, 9, 80, 300];

// 1. A max-heap for the top k: its top is the best score, so a new score is
// compared with the wrong one and the heap keeps the first k it saw.
function topKMaxHeap(values: number[], k: number): number[] {
  const best = new Heap<number>((a, b) => a > b);
  for (const v of values) {
    if (best.size < k) best.push(v);
    else if (v > best.peek()!) best.replaceTop(v);
  }
  const out: number[] = [];
  while (best.size > 0) out.push(best.pop()!);
  return out;
}
console.log("1. top 3 with a max-heap:", topKMaxHeap(scores, 3).join(" "));

// 2. Passing a comparator that returns a number, as Array.prototype.sort expects.
// Any non-zero number is truthy, so "a before b" is true whenever a !== b.
const wrong = new Heap<number>(((a: number, b: number) => a - b) as unknown as (a: number, b: number) => boolean);
for (const v of scores) wrong.push(v);
const drained: number[] = [];
while (wrong.size > 0) drained.push(wrong.pop()!);
console.log("2. comparator a - b:", drained.join(" "));

// 3. 1-based index math on a 0-based array: the children of i are 2i and
// 2i + 1 only when the root is at index 1. With the root at 0, "2 * 0" is
// the root itself, and index 2, a real child of the root, is never compared with it.
function siftDownOneBased(a: number[], i: number): void {
  while (true) {
    let child = 2 * i;
    if (child >= a.length) break;
    if (child + 1 < a.length && a[child + 1] < a[child]) child++;
    if (a[child] >= a[i]) break;
    [a[i], a[child]] = [a[child], a[i]];
    i = child;
  }
}
const arr = [9, 5, 1];
for (let i = (arr.length >> 1) - 1; i >= 0; i--) siftDownOneBased(arr, i);
console.log("3. 1-based math, root at 0:", arr.join(" "), "(the root should be 1)");

// 4. Expecting items with equal priority to come out in the order they went in.
// A heap moves items past each other, so ties come out in no fixed order.
{
  const jobs = ["a", "b", "c", "d", "e"].map((id) => ({ id, priority: 1 }));
  const h = new Heap<{ id: string; priority: number }>((x, y) => x.priority < y.priority);
  for (const j of jobs) h.push(j);
  const order: string[] = [];
  while (h.size > 0) order.push(h.pop()!.id);
  // The fix: a sequence number that breaks ties in arrival order.
  const fixed = new Heap<{ id: string; priority: number; seq: number }>(
    (x, y) => x.priority < y.priority || (x.priority === y.priority && x.seq < y.seq));
  jobs.forEach((j, seq) => fixed.push({ ...j, seq }));
  const fixedOrder: string[] = [];
  while (fixed.size > 0) fixedOrder.push(fixed.pop()!.id);
  console.log("4. equal priorities:", order.join(" "), " with a sequence number:", fixedOrder.join(" "));
}
