// A correct answer to Exercise 4 that fails on long chains: the recursive three-state walk.
// O(V + E) time, but one stack frame per package on the current path.
export function findCycle(pkgs: Map<string, string[]>): string[] | null {
  const state = new Map<string, "path" | "done">();
  const path: string[] = [];
  function visit(name: string): string[] | null {
    const s = state.get(name);
    if (s === "done") return null;
    if (s === "path") return [...path.slice(path.indexOf(name)), name];
    state.set(name, "path");
    path.push(name);
    for (const d of pkgs.get(name) ?? []) {
      const cycle = visit(d);
      if (cycle) return cycle;
    }
    path.pop();
    state.set(name, "done");
    return null;
  }
  for (const name of pkgs.keys()) {
    const cycle = visit(name);
    if (cycle) return cycle;
  }
  return null;
}
