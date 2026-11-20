// Prints Figures 1, 2, 3, 4, 7, 8 and 9 of the module: node trace-demo.ts
// The loops are the loops of heap.ts, topKHeap, dijkstraHeap, RunningMedian and mergeSorted
// with a print added, and each result is checked against the real code.
import assert from "node:assert/strict";
import { Heap } from "./heap.ts";
import { topKHeap } from "./opening-fast.ts";
import { dijkstraHeap, roads } from "./dijkstra.ts";
import { RunningMedian, mergeSorted } from "./variations.ts";

// The array inside a Heap. `private` is only a type, so the array is there at run time.
const itemsOf = <T,>(h: Heap<T>): T[] => (h as unknown as { items: T[] }).items;
const show = (a: (number | undefined)[]) => a.map((x) => (x === undefined ? "_" : String(x))).join(" ");
const lt = (a: number, b: number) => a < b;

const scores = [5, 100, 25, 1000, 9, 80, 300];
const heap = new Heap<number>(lt);
for (const s of scores) heap.push(s);
const items = itemsOf(heap);

console.log("Figure 1: the min-heap after pushing", scores.join(" "), "\n");
console.log("index  " + items.map((_, i) => String(i).padStart(5)).join(""));
console.log("value  " + items.map((x) => String(x).padStart(5)).join(""));

console.log("\nFigure 2: push(7), the loop of siftUp\n");
console.log("hole at   compare with parent        array (_ is the hole)");
{
  const a: (number | undefined)[] = [...items, undefined]; // push puts 7 at the end: the hole
  const item = 7;
  let i = a.length - 1;
  console.log(String(i).padEnd(10) + "-".padEnd(27) + show(a));
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (!lt(item, a[parent]!)) {
      console.log(String(i).padEnd(10) + `${item} < ${a[parent]} (index ${parent})? no`.padEnd(27) + "stop");
      break;
    }
    const text = `${item} < ${a[parent]} (index ${parent}): move`;
    a[i] = a[parent];
    a[parent] = undefined;
    i = parent;
    console.log(String(i).padEnd(10) + text.padEnd(27) + show(a));
  }
  a[i] = item;
  console.log("write 7".padEnd(37) + show(a));
  heap.push(7);
  assert.deepEqual(a, itemsOf(heap));
}

console.log("\nFigure 3: pop(), the loop of siftDown\n");
console.log("hole at   children, smaller one       array (_ is the hole)");
{
  const a: (number | undefined)[] = [...itemsOf(heap)];
  const top = a[0];
  const item = a.pop()!; // the last item leaves the end and sinks from the root
  a[0] = undefined;
  let i = 0;
  const n = a.length;
  console.log(String(i).padEnd(10) + `${top} out, ${item} sinks`.padEnd(28) + show(a));
  while (true) {
    let child = 2 * i + 1;
    if (child >= n) {
      console.log(String(i).padEnd(10) + "none".padEnd(28) + "stop");
      break;
    }
    if (child + 1 < n && lt(a[child + 1]!, a[child]!)) child++;
    if (!lt(a[child]!, item)) {
      console.log(String(i).padEnd(10) + `${a[child]} < ${item}? no`.padEnd(28) + "stop");
      break;
    }
    const pair = child + 1 < n && child % 2 === 1 ? `${a[child]}, ${a[child + 1]}` : `${a[child - 1]}, ${a[child]}`;
    const text = `${pair}: ${a[child]} < ${item}, move`;
    a[i] = a[child];
    a[child] = undefined;
    i = child;
    console.log(String(i).padEnd(10) + text.padEnd(28) + show(a));
  }
  a[i] = item;
  console.log(`write ${item}`.padEnd(38) + show(a));
  assert.equal(heap.pop(), top);
  assert.deepEqual(a, itemsOf(heap));
}

console.log("\nFigure 4: topKHeap(scores, 3)\n");
console.log("score   heap array    action");
{
  const best = new Heap<number>(lt);
  for (const s of scores) {
    let action: string;
    if (best.size < 3) {
      best.push(s);
      action = "push";
    } else if (s > best.peek()!) {
      action = `${s} > ${best.peek()}: replace the top`;
      best.replaceTop(s);
    } else action = `${s} > ${best.peek()}? no: skip`;
    console.log(String(s).padEnd(8) + show(itemsOf(best)).padEnd(14) + action);
  }
  const out: number[] = [];
  while (best.size > 0) out.push(best.pop()!);
  console.log("pop all: " + out.join(" ") + ", reversed: " + out.toReversed().join(" "));
  assert.deepEqual(out.reverse(), topKHeap(scores, 3));
}

console.log("\nFigure 7: dijkstraHeap(roads, 0)\n");
console.log("pop      action           dist 0..4    heap entries, smallest first");
{
  const V = roads.length;
  const dist = new Float64Array(V).fill(Infinity);
  const done = new Uint8Array(V);
  const h = new Heap<[number, number]>((a, b) => a[0] < b[0]);
  const entries = () => itemsOf(h).toSorted((a, b) => a[0] - b[0] || a[1] - b[1]).map(([d, v]) => `[${d},${v}]`).join(" ") || "-";
  const dists = () => Array.from(dist, (d) => (d === Infinity ? "-" : String(d))).join(" ");
  dist[0] = 0;
  h.push([0, 0]);
  console.log("start".padEnd(9) + "-".padEnd(17) + dists().padEnd(13) + entries());
  while (h.size > 0) {
    const [d, u] = h.pop()!;
    if (done[u]) {
      console.log(`[${d},${u}]`.padEnd(9) + `${u} done: skip`.padEnd(17) + dists().padEnd(13) + entries());
      continue;
    }
    done[u] = 1;
    for (const [to, cost] of roads[u]) {
      if (d + cost < dist[to]) {
        dist[to] = d + cost;
        h.push([dist[to], to]);
      }
    }
    console.log(`[${d},${u}]`.padEnd(9) + `finish ${u}`.padEnd(17) + dists().padEnd(13) + entries());
  }
  assert.deepEqual(dist, dijkstraHeap(roads, 0));
}

console.log("\nFigure 8: RunningMedian, add 5 15 1 3 8\n");
console.log("add   low, largest first   high, smallest first   median");
{
  const low = new Heap<number>((a, b) => a > b);
  const high = new Heap<number>(lt);
  const real = new RunningMedian();
  for (const x of [5, 15, 1, 3, 8]) {
    if (low.size === 0 || x <= low.peek()!) low.push(x);
    else high.push(x);
    if (low.size > high.size + 1) high.push(low.pop()!);
    else if (high.size > low.size) low.push(high.pop()!);
    const median = low.size > high.size ? low.peek()! : (low.peek()! + high.peek()!) / 2;
    real.add(x);
    assert.equal(median, real.median());
    const l = itemsOf(low).toSorted((a, b) => b - a).join(" ");
    const r = itemsOf(high).toSorted((a, b) => a - b).join(" ") || "-";
    console.log(String(x).padEnd(6) + l.padEnd(21) + r.padEnd(23) + median);
  }
}

console.log("\nFigure 9: mergeSorted([[1, 4, 9], [2, 3, 10], [5]])\n");
console.log("take   heap entries [value,list,position], smallest first   output");
{
  const lists = [[1, 4, 9], [2, 3, 10], [5]];
  const h = new Heap<[number, number, number]>((a, b) => a[0] < b[0]);
  lists.forEach((list, i) => { if (list.length > 0) h.push([list[0], i, 0]); });
  const entries = () => itemsOf(h).toSorted((a, b) => a[0] - b[0]).map((e) => `[${e.join(",")}]`).join(" ") || "-";
  const out: number[] = [];
  console.log("-".padEnd(7) + entries().padEnd(52) + "-");
  while (h.size > 0) {
    const [value, i, pos] = h.peek()!;
    out.push(value);
    if (pos + 1 < lists[i].length) h.replaceTop([lists[i][pos + 1], i, pos + 1]);
    else h.pop();
    console.log(String(value).padEnd(7) + entries().padEnd(52) + out.join(" "));
  }
  assert.deepEqual(out, mergeSorted(lists));
}
