// Research only: the time of each run of topKHeap at 250,000 scores in a fresh process,
// to see how many runs the JIT needs before the time settles: node warm-up.ts
import { topKHeap } from "./opening-fast.ts";
import { makeScores } from "./opening-slow.ts";

const times: string[] = [];
for (let r = 0; r < 12; r++) {
  const s = makeScores(250_000);
  const t = performance.now();
  topKHeap(s);
  times.push((performance.now() - t).toFixed(2));
}
console.log("ms per run:", times.join(" "));
