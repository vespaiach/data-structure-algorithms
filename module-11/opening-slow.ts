// Opening problem: how many ways can you climb n steps, taking 1 or 2 steps at a time?
// The slow version: node opening-slow.ts
import { bench } from "./bench.ts";

// Plain recursion: the last move was 1 step or 2 steps. Every call makes two more calls, so
// it's O(phi^n) time (phi is about 1.618) and O(n) memory for the call stack.
export function waysSlow(n: number): number {
  if (n <= 1) return 1; // 0 steps: one way (do nothing); 1 step: one way
  return waysSlow(n - 1) + waysSlow(n - 2);
}

if (process.argv[1] === import.meta.filename) {
  console.log([0, 1, 2, 3, 4, 5, 10].map((n) => `ways(${n}) = ${waysSlow(n)}`).join(", "));
  bench("waysSlow", [30, 35, 40], (n) => n, waysSlow);
}
