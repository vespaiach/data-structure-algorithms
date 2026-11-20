// How often does topKHeap replace its top? Its loop with a counter, k = 10, the median of 5 runs
// on random scores, next to k * ln(n / k): node replacements.ts
import { Heap } from "./heap.ts";
import { makeScores } from "./opening-slow.ts";

function countReplacements(scores: number[], k = 10): number {
  const best = new Heap<number>((a, b) => a < b);
  let count = 0;
  for (const s of scores) {
    if (best.size < k) best.push(s);
    else if (s > best.peek()!) { best.replaceTop(s); count++; }
  }
  return count;
}

for (const n of [10_000, 100_000, 1_000_000, 8_000_000]) {
  const counts = Array.from({ length: 5 }, () => countReplacements(makeScores(n))).sort((a, b) => a - b);
  console.log(`n=${n.toLocaleString("en-US").padStart(9)}  replacements ${String(counts[2]).padStart(4)}  k*ln(n/k) ${(10 * Math.log(n / 10)).toFixed(0).padStart(4)}`);
}
