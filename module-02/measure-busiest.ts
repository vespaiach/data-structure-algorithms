import { bench } from "./bench.ts";
import { busiestSlow, busiestWindow, busiestByPrefix, SECONDS } from "./busiest.ts";

// n requests at random whole seconds of one day, sorted.
const log = (n: number): number[] =>
  Array.from({ length: n }, () => Math.floor(Math.random() * SECONDS)).sort((a, b) => a - b);

bench("busiestSlow", [10_000, 20_000, 40_000], log, busiestSlow);
bench("busiestWindow", [10_000, 20_000, 40_000], log, busiestWindow);
bench("busiestByPrefix", [10_000, 20_000, 40_000], log, busiestByPrefix);
bench("busiestWindow, larger", [100_000, 1_000_000, 10_000_000], log, busiestWindow);
bench("busiestByPrefix, larger", [100_000, 1_000_000, 10_000_000], log, busiestByPrefix);
