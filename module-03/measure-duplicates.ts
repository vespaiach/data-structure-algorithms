import { bench } from "./bench.ts";
import { firstDuplicateSlow, firstDuplicate, hasDuplicateBySorting, type Order } from "./duplicates.ts";

// n orders with random 10-character IDs: no duplicates in practice, the worst case.
const orders = (n: number): Order[] =>
  Array.from({ length: n }, () => ({ id: Math.random().toString(36).slice(2, 12), customer: "c1", amount: 10 }));

bench("firstDuplicateSlow", [5_000, 10_000, 20_000], orders, firstDuplicateSlow);
bench("firstDuplicate (Set)", [5_000, 10_000, 20_000], orders, firstDuplicate);
bench("hasDuplicateBySorting", [5_000, 10_000, 20_000], orders, hasDuplicateBySorting);
bench("firstDuplicate (Set), larger", [100_000, 1_000_000], orders, firstDuplicate);
bench("hasDuplicateBySorting, larger", [100_000, 1_000_000], orders, hasDuplicateBySorting);
