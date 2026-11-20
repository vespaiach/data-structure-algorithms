// Everything a package needs, with and without a visited set: node needs.ts
import type { Packages } from "./packages.ts";

// Every package that `name` needs, directly or through other packages, in the order first reached.
// Depth first with an explicit stack and a visited set: O(V + E) time, O(V) memory.
export function allDeps(pkgs: Packages, name: string): string[] {
  const seen = new Set<string>([name]);
  const stack = [name];
  while (stack.length > 0) {
    const pkg = stack.pop()!;
    for (const d of pkgs.get(pkg) ?? []) {
      if (seen.has(d)) continue; // reached before, through another package
      seen.add(d); // mark when pushed, so no package is on the stack twice
      stack.push(d);
    }
  }
  seen.delete(name);
  return [...seen];
}

// The same walk with no visited set. It returns how many times it pushed a package.
export function pushesWithoutSet(pkgs: Packages, name: string): number {
  let pushes = 0;
  const stack = [name];
  while (stack.length > 0) {
    const pkg = stack.pop()!;
    for (const d of pkgs.get(pkg) ?? []) {
      stack.push(d);
      pushes++;
    }
  }
  return pushes;
}

// A ladder of k rungs: a0 and b0 both need a1 and b1, which both need a2 and b2, and so on.
export function ladder(k: number): Packages {
  const pkgs: Packages = new Map();
  for (let i = 0; i <= k; i++) {
    const next = i < k ? [`a${i + 1}`, `b${i + 1}`] : [];
    pkgs.set(`a${i}`, next);
    pkgs.set(`b${i}`, next);
  }
  return pkgs;
}

if (process.argv[1] === import.meta.filename) {
  const project: Packages = new Map([
    ["app", ["ui", "api"]],
    ["ui", ["core"]],
    ["api", ["core", "db"]],
    ["db", []],
    ["core", []],
  ]);
  console.log("allDeps(app):", allDeps(project, "app").join(" "));
  for (const k of [10, 20, 25]) {
    const pkgs = ladder(k);
    let start = performance.now();
    const found = allDeps(pkgs, "a0").length;
    const withSet = performance.now() - start;
    start = performance.now();
    const pushes = pushesWithoutSet(pkgs, "a0");
    const without = performance.now() - start;
    console.log(`ladder of ${k}: ${pkgs.size} packages, a0 needs ${found}; with the set ${withSet.toFixed(2)} ms, without it ${pushes.toLocaleString("en-US")} pushes in ${without.toFixed(0)} ms`);
  }
}
