// The top k with a heap of size k: node opening-fast.ts
import { bench } from "./bench.ts";
import { Heap } from "./heap.ts";
import { makeScores, topTenSort } from "./opening-slow.ts";

// Keep the k best scores seen so far in a min-heap. Its top is the weakest of the k,
// the only one a new score has to beat. O(n log k) time, O(k) extra memory.
export function topKHeap(scores: number[], k = 10): number[] {
  const best = new Heap<number>((a, b) => a < b);
  for (const s of scores) {
    if (best.size < k) best.push(s);
    else if (k > 0 && s > best.peek()!) best.replaceTop(s); // drop the weakest, sift the new score down
  }
  const out: number[] = [];
  while (best.size > 0) out.push(best.pop()!); // weakest first
  return out.reverse();
}

if (process.argv[1] === import.meta.filename) {
  const scores = [5, 100, 25, 1000, 9, 80, 300];
  console.log("top 3 of", scores.join(" "), "->", topKHeap(scores, 3).join(" "));
  const sizes = [250_000, 500_000, 1_000_000];
  bench("topTenSort", sizes, makeScores, topTenSort);
  bench("topKHeap", sizes, makeScores, topKHeap);
  bench("topKHeap, larger", [2_000_000, 4_000_000, 8_000_000], makeScores, topKHeap);
  // The worst case: rising scores, so every score beats the top and pays a full sift down.
  const rising = (n: number) => Array.from({ length: n }, (_, i) => i);
  bench("topKHeap, rising scores", sizes, rising, topKHeap);
}
