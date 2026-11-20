// Time each busiest-minute function once on a large log: node one-large-run.ts 500000
// busiestSlow takes minutes at 500,000 requests.
import { busiestSlow, busiestWindow, SECONDS } from "./busiest.ts";

const n = Number(process.argv[2] ?? 100_000);
const times = Array.from({ length: n }, () => Math.floor(Math.random() * SECONDS)).sort((a, b) => a - b);
for (const busiest of [busiestWindow, busiestSlow]) {
  const start = performance.now();
  const { start: at, count } = busiest(times);
  const seconds = (performance.now() - start) / 1000;
  console.log(`${busiest.name}: ${n.toLocaleString("en-US")} requests, ${count} in the minute from second ${at}, ${seconds.toFixed(3)} s`);
}
