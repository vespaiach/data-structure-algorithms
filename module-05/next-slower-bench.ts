// The next slower request, by scanning and with a monotonic stack: node next-slower-bench.ts
import { bench } from "./bench.ts";
import { nextSlower } from "./next-slower.ts";

// For each request, scan forward until a slower one. O(n^2) in the worst case.
export function nextSlowerScan(ms: number[]): number[] {
  return ms.map((v, i) => {
    for (let j = i + 1; j < ms.length; j++) if (ms[j] > v) return j;
    return -1;
  });
}

const falling = (n: number) => Array.from({ length: n }, (_, i) => n - i); // each request faster than the last
const random = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 1000));

if (process.argv[1] === import.meta.filename) {
  const sizes = [10_000, 20_000, 40_000];
  bench("next slower, scan, falling times", sizes, falling, nextSlowerScan);
  bench("next slower, monotonic stack, falling times", sizes, falling, nextSlower);
  bench("next slower, scan, random times", sizes, random, nextSlowerScan);
  bench("next slower, monotonic stack, random times", sizes, random, nextSlower);
}
