// Building a heap from a whole list: n pushes against one bottom-up pass: node build-count.ts
// The table counts calls to the comparison function; the benchmarks time both ways.
import { bench } from "./bench.ts";
import { Heap } from "./heap.ts";

const randomValues = (n: number) => Array.from({ length: n }, () => Math.random());
const rising = (n: number) => Array.from({ length: n }, (_, i) => i);
const lt = (a: number, b: number) => a < b;

// n pushes, each sifting up: O(n log n) in the worst case.
function byPushes(values: number[], before = lt): number | undefined {
  const h = new Heap<number>(before);
  for (const v of values) h.push(v);
  return h.peek(); // return something, so the work cannot be thrown away
}

// The constructor sifts down every parent, from the last one to the root: O(n).
function bottomUp(values: number[], before = lt): number | undefined {
  return new Heap<number>(before, values).peek();
}

function compares(values: number[], build: (v: number[], before: typeof lt) => unknown, before = lt): number {
  let count = 0;
  build(values, (a, b) => { count++; return before(a, b); });
  return count;
}

if (process.argv[1] === import.meta.filename) {
  const gt = (a: number, b: number) => a > b; // max-heap: rising values all climb to the root
  console.log("compares per item");
  console.log("n".padStart(12) + "pushes".padStart(10) + "bottom-up".padStart(12) + "pushes, rising".padStart(17) + "bottom-up, rising".padStart(20));
  for (const n of [1_000, 10_000, 100_000, 1_000_000]) {
    const row = [
      compares(randomValues(n), byPushes), compares(randomValues(n), bottomUp),
      compares(rising(n), byPushes, gt), compares(rising(n), bottomUp, gt),
    ].map((c) => (c / n).toFixed(2));
    console.log(n.toLocaleString("en-US").padStart(12) + row[0].padStart(10) + row[1].padStart(12) + row[2].padStart(17) + row[3].padStart(20));
  }
  const sizes = [1_000_000, 2_000_000, 4_000_000];
  bench("heap by n pushes", sizes, randomValues, byPushes);
  bench("heap bottom-up", sizes, randomValues, bottomUp);
}
