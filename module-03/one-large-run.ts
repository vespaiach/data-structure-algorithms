// Time each duplicate check once on a large list: node one-large-run.ts 200000
// firstDuplicateSlow takes minutes at 200,000 orders.
import { firstDuplicateSlow, firstDuplicate, type Order } from "./duplicates.ts";

const n = Number(process.argv[2] ?? 20_000);
const orders: Order[] = Array.from({ length: n }, () => ({
  id: Math.random().toString(36).slice(2, 12),
  customer: "c1",
  amount: 10,
}));
for (const check of [firstDuplicate, firstDuplicateSlow]) {
  const start = performance.now();
  const id = check(orders);
  const seconds = (performance.now() - start) / 1000;
  console.log(`${check.name}: ${n.toLocaleString("en-US")} orders, first duplicate ${id}, ${seconds.toFixed(3)} s`);
}
