// Prints Figures 1, 2, 3, 4, 6 and 8 of the module: node trace-demo.ts
// The loops are the loops of minutesFor, lowerBound, upperBound, smallestBatchFast,
// mostMeetings and mergeBusy with a print added, and each result is checked against the real code.
import assert from "node:assert/strict";
import { minutesFor, smallestBatchSlow } from "./opening-slow.ts";
import { smallestBatchFast } from "./opening-fast.ts";
import { lowerBound, upperBound } from "./bounds.ts";
import { type Meeting, mostMeetings } from "./meetings.ts";
import { mergeBusy } from "./variations.ts";

const records = [9, 4, 7, 2, 6], limit = 10;

console.log("Figure 1: minutes for each batch size, records 9 4 7 2 6, limit 10\n");
{
  const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const minutes = sizes.map((s) => minutesFor(records, s));
  const col = (xs: (string | number)[]) => xs.map((x) => String(x).padStart(4)).join("");
  console.log("size     " + col(sizes));
  console.log("minutes  " + col(minutes));
  console.log("fits?    " + col(minutes.map((m) => (m <= limit ? "yes" : "no"))));
  assert.equal(smallestBatchSlow({ records, limit }), sizes[minutes.findIndex((m) => m <= limit)]);
}

// One binary search, printed step by step. `tooSmall(x)` is the test that moves lo.
function traceBounds(a: number[], target: number, tooSmall: (x: number) => boolean, test: string): number {
  const box = (x: number) => `[${x}]`.padEnd(4);
  const mark = (i: number, name: string) => " ".repeat(4 * i + 1) + "^" + name;
  let lo = 0, hi = a.length;
  console.log("step  lo  hi  mid  a[mid]  " + test.padEnd(14) + "then");
  for (let step = 1; lo < hi; step++) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const small = tooSmall(a[mid]);
    const then = small ? `lo = ${mid + 1}` : `hi = ${mid}`;
    console.log(`${String(step).padEnd(6)}${String(lo).padEnd(4)}${String(hi).padEnd(4)}${String(mid).padEnd(5)}${String(a[mid]).padEnd(8)}${(small ? "yes" : "no").padEnd(14)}${then}`);
    if (small) lo = mid + 1;
    else hi = mid;
  }
  console.log(`\nlo = hi = ${lo}:`);
  console.log(a.map(box).join("").trimEnd());
  console.log(a.map((_, i) => String(i).padEnd(4)).join("").replace(/^/, " ") + a.length);
  console.log(mark(lo, "lo, hi"));
  return lo;
}

const a = [1, 3, 7, 7, 7, 9];
console.log("\nFigure 2: lowerBound(a, 7) on a = 1 3 7 7 7 9\n");
assert.equal(traceBounds(a, 7, (x) => x < 7, "a[mid] < 7?"), lowerBound(a, 7));
console.log("\nFigure 3: upperBound(a, 7)\n");
assert.equal(traceBounds(a, 7, (x) => x <= 7, "a[mid] <= 7?"), upperBound(a, 7));

console.log("\nFigure 4: smallestBatchFast, records 9 4 7 2 6, limit 10\n");
{
  let lo = 1, hi = Math.max(...records);
  console.log("lo  hi  mid  minutes(mid)  fits?  then");
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const m = minutesFor(records, mid), fits = m <= limit;
    console.log(`${String(lo).padEnd(4)}${String(hi).padEnd(4)}${String(mid).padEnd(5)}${String(m).padEnd(14)}${(fits ? "yes" : "no").padEnd(7)}${fits ? `hi = ${mid}` : `lo = ${mid + 1}`}`);
    if (fits) hi = mid;
    else lo = mid + 1;
  }
  console.log(`lo = hi = ${lo}: the answer`);
  assert.equal(lo, smallestBatchFast({ records, limit }));
}

const day: Meeting[] = [[9, 17], [9, 11], [10, 12], [11, 13], [13, 15], [12, 16]];
console.log("\nFigure 6: mostMeetings, sorted by end\n");
{
  const taken: Meeting[] = [];
  let free = -Infinity;
  console.log("meeting   free from   start >= free?   taken");
  for (const m of day.toSorted((x, y) => x[1] - y[1])) {
    const ok = m[0] >= free;
    const before = free === -Infinity ? "-" : String(free);
    if (ok) {
      taken.push(m);
      free = m[1];
    }
    console.log(`[${m[0]}, ${m[1]})`.padEnd(10) + before.padEnd(12) + (ok ? "yes" : "no").padEnd(17) + taken.map((t) => `[${t[0]}, ${t[1]})`).join(" "));
  }
  assert.deepEqual(taken, mostMeetings(day));
}

const busy: Meeting[] = [[8, 10], [1, 3], [2, 6], [15, 18], [10, 12]];
console.log("\nFigure 8: mergeBusy, sorted by start\n");
{
  const out: Meeting[] = [];
  console.log("interval  last block   start < block end?   blocks");
  for (const [s, e] of busy.toSorted((x, y) => x[0] - y[0])) {
    const last = out.at(-1);
    const lastText = last ? `[${last[0]}, ${last[1]})` : "-";
    const inside = last !== undefined && s < last[1];
    if (last && inside) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
    console.log(`[${s}, ${e})`.padEnd(10) + lastText.padEnd(13) + (last ? (inside ? "yes: extend" : "no: new block") : "no block yet").padEnd(21) + out.map((b) => `[${b[0]}, ${b[1]})`).join(" "));
  }
  assert.deepEqual(out, mergeBusy(busy));
}
