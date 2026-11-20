// Opening problem: build every package after the packages it depends on. The slow version: node opening-slow.ts
import { bench } from "./bench.ts";
import { makePackages, type Packages } from "./packages.ts";

// Scan the list for a package whose dependencies are all built, build it, and scan again from the top.
// Up to V scans, and each can read every package and dependency: O(V * (V + E)) time, O(V) memory.
export function buildOrderSlow(pkgs: Packages): string[] {
  const order: string[] = [];
  const built = new Set<string>();
  while (order.length < pkgs.size) {
    let found = false;
    for (const [name, deps] of pkgs) {
      if (!built.has(name) && deps.every((d) => built.has(d))) {
        built.add(name);
        order.push(name);
        found = true;
        break;
      }
    }
    if (!found) throw new Error("cycle: no package can be built");
  }
  return order;
}

if (process.argv[1] === import.meta.filename) {
  const project: Packages = new Map([
    ["app", ["ui", "api"]],
    ["ui", ["core"]],
    ["api", ["core", "db"]],
    ["db", []],
    ["core", []],
  ]);
  console.log("build order:", buildOrderSlow(project).join(" "));
  bench("buildOrderSlow", [2_000, 4_000, 8_000], makePackages, buildOrderSlow);
}
