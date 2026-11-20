// The maximum of every window, by scanning and with a deque: node window-max-bench.ts
import { bench } from "./bench.ts";
import { windowMax } from "./window-max.ts";

// Scan every window from scratch. O(n * k).
export function windowMaxScan(samples: number[], k: number): number[] {
  const out: number[] = [];
  for (let i = 0; i + k <= samples.length; i++) {
    let max = samples[i];
    for (let j = i + 1; j < i + k; j++) if (samples[j] > max) max = samples[j];
    out.push(max);
  }
  return out;
}

const random = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 1000));

if (process.argv[1] === import.meta.filename) {
  const sizes = [100_000, 200_000, 400_000];
  bench("window max k = 1,000, scan", sizes, random, (s) => windowMaxScan(s, 1000));
  bench("window max k = 1,000, deque", sizes, random, (s) => windowMax(s, 1000));

  // The same 200,000 samples with a growing k. The "n" column is k here.
  const ks = [10, 100, 1_000, 10_000];
  const input = (k: number) => ({ samples: random(200_000), k });
  bench("window max, 200,000 samples, scan (n = k)", ks, input, ({ samples, k }) => windowMaxScan(samples, k));
  bench("window max, 200,000 samples, deque (n = k)", ks, input, ({ samples, k }) => windowMax(samples, k));
}
