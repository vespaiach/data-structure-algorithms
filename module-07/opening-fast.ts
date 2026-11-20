// The build order with Kahn's algorithm: node opening-fast.ts
import { bench } from "./bench.ts";
import { makePackages, type Packages } from "./packages.ts";
import { buildOrderSlow } from "./opening-slow.ts";

// Count the dependencies each package still waits for. A package at 0 is ready; building it
// lowers the count of every package that depends on it.
// O(V + E) time: each package enters the order once, and each edge is followed once.
// O(V + E) memory for the dependents lists, the counts and the order.
export function buildOrderKahn(pkgs: Packages): string[] {
  const dependents = new Map<string, string[]>(); // the edges turned around: package -> packages that need it
  const waiting = new Map<string, number>(); // dependencies not built yet
  for (const [name, deps] of pkgs) {
    waiting.set(name, deps.length);
    for (const d of deps) {
      if (!pkgs.has(d)) throw new Error(`${name} depends on ${d}, which is not in the list`);
      dependents.getOrInsertComputed(d, () => []).push(name);
    }
  }
  const order: string[] = [];
  for (const [name, count] of waiting) if (count === 0) order.push(name);
  // `order` is also the queue: `head` moves forward instead of shift() (Module 5).
  for (let head = 0; head < order.length; head++) {
    for (const next of dependents.get(order[head]) ?? []) {
      const left = waiting.get(next)! - 1;
      waiting.set(next, left);
      if (left === 0) order.push(next);
    }
  }
  if (order.length < pkgs.size) throw new Error("cycle: some packages can never be built");
  return order;
}

if (process.argv[1] === import.meta.filename) {
  const sizes = [2_000, 4_000, 8_000];
  bench("buildOrderSlow", sizes, makePackages, buildOrderSlow);
  bench("buildOrderKahn", sizes, makePackages, buildOrderKahn);
  bench("buildOrderKahn, larger", [100_000, 200_000, 400_000], makePackages, buildOrderKahn);
}
