// "Is there a duplicate?" on numbers: a Set against sorting a typed array.
import { bench } from "./bench.ts";

const sizes = [100_000, 1_000_000, 10_000_000];
// Distinct random doubles: no duplicate, the worst case for both.
const values = (n: number): number[] => Array.from({ length: n }, () => Math.random());

bench("Set", sizes, values, (list) => new Set(list).size !== list.length);

bench("Float64Array.from(list).sort(), then compare neighbours", sizes, values, (list) => {
  const sorted = Float64Array.from(list).sort(); // typed arrays sort numerically by default
  for (let i = 1; i < sorted.length; i++) if (sorted[i] === sorted[i - 1]) return true;
  return false;
});

bench("list.sort((a, b) => a - b), then compare neighbours", sizes, values, (list) => {
  list.sort((a, b) => a - b);
  for (let i = 1; i < list.length; i++) if (list[i] === list[i - 1]) return true;
  return false;
});
