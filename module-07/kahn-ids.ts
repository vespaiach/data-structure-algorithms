// Kahn's algorithm on numbered nodes: number the names once, then use
// arrays indexed by number instead of Maps keyed by string.
// Same O(V + E) cost as buildOrderKahn; smaller constant.
import { bench } from "./bench.ts";
import { makePackages, isValidOrder, type Packages } from "./packages.ts";
import { buildOrderKahn } from "./opening-fast.ts";

export function buildOrderKahnIds(pkgs: Packages): string[] {
  const names = [...pkgs.keys()];
  const id = new Map(names.map((name, i) => [name, i]));
  const n = names.length;
  const waiting = new Int32Array(n);
  const dependents: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    const deps = pkgs.get(names[i])!;
    waiting[i] = deps.length;
    for (const d of deps) dependents[id.get(d)!].push(i);
  }
  const queue = new Int32Array(n);
  let tail = 0;
  for (let i = 0; i < n; i++) if (waiting[i] === 0) queue[tail++] = i;
  for (let head = 0; head < tail; head++) {
    for (const next of dependents[queue[head]]) if (--waiting[next] === 0) queue[tail++] = next;
  }
  if (tail < n) throw new Error("cycle: some packages can never be built");
  return Array.from(queue, (i) => names[i]);
}

if (process.argv[1] === import.meta.filename) {
  const p = makePackages(1000);
  console.log("valid:", isValidOrder(p, buildOrderKahnIds(p)));
  const sizes = [50_000, 100_000, 200_000, 400_000];
  bench("buildOrderKahn (Maps keyed by name)", sizes, makePackages, buildOrderKahn);
  bench("buildOrderKahnIds (typed arrays by number)", sizes, makePackages, buildOrderKahnIds);
}
