// A correct but slow answer to Exercise 3: for each stage, scan every package not placed yet
// and keep those whose dependencies are all in earlier stages. O(S * (V + E)) time for S stages,
// so O(V^2) on a long chain.
export function buildStages(pkgs: Map<string, string[]>): string[][] {
  for (const [name, deps] of pkgs) {
    for (const d of deps) if (!pkgs.has(d)) throw new Error(`${name} depends on ${d}, which is not in the list`);
  }
  const placed = new Set<string>();
  const stages: string[][] = [];
  while (placed.size < pkgs.size) {
    const stage: string[] = [];
    for (const [name, deps] of pkgs) {
      if (!placed.has(name) && deps.every((d) => placed.has(d))) stage.push(name);
    }
    if (stage.length === 0) throw new Error("cycle: some packages can never be built");
    for (const name of stage) placed.add(name);
    stages.push(stage.sort());
  }
  return stages;
}
