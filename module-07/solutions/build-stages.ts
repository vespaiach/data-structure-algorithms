// Exercise 3: groups packages into stages that can build in parallel. The first stage holds the
// packages with no dependencies, and each later stage only depends on earlier stages.
// Names inside a stage are sorted. Throws on a cycle or on a dependency that is not in the list.
// Kahn's algorithm, one stage at a time: the packages that reach 0 while a stage is built
// form the next stage. O(V log V + E) time (the sort inside each stage), O(V + E) memory.
export function buildStages(pkgs: Map<string, string[]>): string[][] {
  const dependents = new Map<string, string[]>();
  const waiting = new Map<string, number>();
  for (const [name, deps] of pkgs) {
    waiting.set(name, deps.length);
    for (const d of deps) {
      if (!pkgs.has(d)) throw new Error(`${name} depends on ${d}, which is not in the list`);
      dependents.getOrInsertComputed(d, () => []).push(name);
    }
  }
  const stages: string[][] = [];
  let stage = [...pkgs.keys()].filter((name) => waiting.get(name) === 0);
  let placed = 0;
  while (stage.length > 0) {
    stages.push(stage.sort());
    placed += stage.length;
    const next: string[] = [];
    for (const name of stage) {
      for (const d of dependents.get(name) ?? []) {
        const left = waiting.get(d)! - 1;
        waiting.set(d, left);
        if (left === 0) next.push(d);
      }
    }
    stage = next;
  }
  if (placed < pkgs.size) throw new Error("cycle: some packages can never be built");
  return stages;
}
