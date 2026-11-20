// What a result costs: share one path and only count, copy the path at each node, or
// build a new array on every call: node copy-vs-share.ts
import assert from "node:assert/strict";
import { bench } from "./bench.ts";
import { subsets } from "./shapes.ts";

const items = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

// Shares one path and keeps no output: counts the subsets. O(2^n) time, O(n) memory.
export function countSubsets(xs: number[]): number {
  let count = 0;
  const path: number[] = [];
  function explore(start: number): void {
    count++;
    for (let i = start; i < xs.length; i++) {
      path.push(xs[i]);
      explore(i + 1);
      path.pop();
    }
  }
  explore(0);
  return count;
}

// No shared path and no undo: concat builds a new array on every call. O(2^n * n) time and memory.
export function subsetsConcat(xs: number[]): number[][] {
  const out: number[][] = [];
  function explore(start: number, path: number[]): void {
    out.push(path);
    for (let i = start; i < xs.length; i++) explore(i + 1, path.concat(xs[i]));
  }
  explore(0, []);
  return out;
}

if (process.argv[1] === import.meta.filename) {
  assert.deepEqual(subsetsConcat(items(10)), subsets(items(10)));
  assert.equal(countSubsets(items(10)), 1024);
  const sizes = [16, 18, 20];
  bench("countSubsets (shared path, no output)", sizes, items, countSubsets);
  bench("subsets (shared path, copy per node)", sizes, items, subsets);
  bench("subsetsConcat (new array per call)", sizes, items, subsetsConcat);
}
