// Roughly how many simple loop steps this machine does per second.
import { bench } from "./bench.ts";

bench("sum of 0..n-1 in a plain loop", [10_000_000, 100_000_000, 1_000_000_000], (n) => n, (n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += i;
  return sum;
}, 3);
