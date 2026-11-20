// The cost of common array, Set and Map operations, measured at three sizes.
// Each function does 1,000 operations on a collection of n items, so the time
// stays flat for O(1) operations and grows about 10x per row for O(n) ones.
// Loops that only read return a count or a sum, so the compiler cannot remove the work.
import { bench } from "./bench.ts";

const sizes = [10_000, 100_000, 1_000_000];
const numbers = (n: number): number[] => Array.from({ length: n }, (_, i) => i);
const OPS = 1_000;

bench("push 1,000 items", sizes, numbers, (a) => {
  for (let i = 0; i < OPS; i++) a.push(i);
});
bench("pop 1,000 items", sizes, numbers, (a) => {
  let sum = 0;
  for (let i = 0; i < OPS; i++) sum += a.pop()!;
  return sum;
});
bench("includes() on a missing value, 1,000 times", sizes, numbers, (a) => {
  let found = 0;
  for (let i = 0; i < OPS; i++) if (a.includes(-1 - i)) found++;
  return found;
});
bench("Set.has() on a missing value, 1,000 times", sizes, (n) => new Set(numbers(n)), (s) => {
  let found = 0;
  for (let i = 0; i < OPS; i++) if (s.has(-1 - i)) found++;
  return found;
});
bench("Map.get() on a present key, 1,000 times", sizes, (n) => new Map(numbers(n).map((i) => [i, i])), (m) => {
  let sum = 0;
  for (let i = 0; i < OPS; i++) sum += m.get(i)!;
  return sum;
});
bench("unshift 1,000 items", sizes, numbers, (a) => {
  for (let i = 0; i < OPS; i++) a.unshift(i);
});
bench("splice() one item out of the middle, 1,000 times", sizes, numbers, (a) => {
  for (let i = 0; i < OPS; i++) a.splice(a.length >> 1, 1);
});
bench("shift 1,000 items", sizes, numbers, (a) => {
  for (let i = 0; i < OPS; i++) a.shift();
});
bench("copy with [...a], once", sizes, numbers, (a) => [...a]);
bench("sort() a shuffled array with (x, y) => x - y, once", sizes,
  (n) => numbers(n).map(() => Math.random()),
  (a) => a.sort((x, y) => x - y));
