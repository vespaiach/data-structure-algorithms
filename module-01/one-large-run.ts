// Time each dedupe function once on a large input: node one-large-run.ts 2000000
// dedupeSlow takes minutes at 2,000,000 IDs.
import { dedupeSlow, dedupeFast } from "./dedupe.ts";

const n = Number(process.argv[2] ?? 1_000_000);
const ids = Array.from({ length: n }, () => Math.floor(Math.random() * n));
for (const dedupe of [dedupeFast, dedupeSlow]) {
  const start = performance.now();
  const kept = dedupe(ids);
  const seconds = (performance.now() - start) / 1000;
  console.log(`${dedupe.name}: ${n.toLocaleString("en-US")} IDs, ${kept.length.toLocaleString("en-US")} kept, ${seconds.toFixed(2)} s`);
}
