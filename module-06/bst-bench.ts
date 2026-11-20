// Height and build time of a plain BST, with shuffled keys and with sorted keys: node bst-bench.ts
import { bench } from "./bench.ts";
import { build, height, shuffled } from "./bst.ts";

const sorted = (n: number) => Array.from({ length: n }, (_, i) => i);

for (const n of [1_000, 10_000, 100_000]) {
  const tall = n <= 10_000 ? height(build(sorted(n))) : "(not built)";
  console.log(`n = ${n}: height ${height(build(shuffled(n)))} with shuffled keys, ${tall} with sorted keys, log2(n) = ${Math.log2(n).toFixed(1)}`);
}
bench("build from shuffled keys", [5_000, 10_000, 20_000], shuffled, build);
bench("build from sorted keys", [5_000, 10_000, 20_000], sorted, build);
