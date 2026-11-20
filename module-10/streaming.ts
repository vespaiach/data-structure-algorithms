// Hand each result to the caller instead of keeping a list: a callback or a generator: node streaming.ts
import assert from "node:assert/strict";
import { bench } from "./bench.ts";

const items = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

// Calls visit(path) at every node. The path is shared: visit must copy it to keep it.
// O(2^n) time plus the work of visit, O(n) memory.
export function eachSubset(xs: number[], visit: (path: readonly number[]) => void): void {
  const path: number[] = [];
  function explore(start: number): void {
    visit(path);
    for (let i = start; i < xs.length; i++) {
      path.push(xs[i]);
      explore(i + 1);
      path.pop();
    }
  }
  explore(0);
}

// The same walk as a generator. Each yield* passes the value up through every level
// above it, so a subset found at depth d costs O(d) more to reach the caller.
export function* subsetGen(xs: number[], start = 0, path: number[] = []): Generator<readonly number[]> {
  yield path;
  for (let i = start; i < xs.length; i++) {
    path.push(xs[i]);
    yield* subsetGen(xs, i + 1, path);
    path.pop();
  }
}

// The consumer adds up the subset sizes, so both versions do the same work per result.
function sizesByCallback(xs: number[]): number {
  let total = 0;
  eachSubset(xs, (p) => { total += p.length; });
  return total;
}
function sizesByGenerator(xs: number[]): number {
  let total = 0;
  for (const p of subsetGen(xs)) total += p.length;
  return total;
}

if (process.argv[1] === import.meta.filename) {
  assert.equal(sizesByCallback(items(12)), sizesByGenerator(items(12)));
  assert.equal(sizesByCallback(items(12)), 12 * 2 ** 11); // each item is in half of the subsets

  // Iterator helpers (ES2025) stop the search after the first results it needs.
  const start = performance.now();
  const firstFive = subsetGen(items(40)).map((p) => p.join("+") || "-").take(5).toArray();
  console.log("first 5 of 2^40 subsets:", firstFive.join("  "), `(${(performance.now() - start).toFixed(2)} ms)`);

  const sizes = [16, 18, 20];
  bench("callback", sizes, items, sizesByCallback);
  bench("generator with yield*", sizes, items, sizesByGenerator);
}
