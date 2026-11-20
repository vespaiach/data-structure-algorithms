import { bench } from "./bench.ts";
import { dedupeSlow, dedupeFast } from "./dedupe.ts";

// n user IDs drawn from 0..n-1, so about 63% of them are distinct.
const userIds = (n: number): number[] => Array.from({ length: n }, () => Math.floor(Math.random() * n));

bench("dedupeSlow", [10_000, 20_000, 40_000, 80_000], userIds, dedupeSlow);
bench("dedupeFast", [10_000, 20_000, 40_000, 80_000], userIds, dedupeFast);
bench("dedupeFast, larger", [100_000, 1_000_000, 10_000_000], userIds, dedupeFast);
