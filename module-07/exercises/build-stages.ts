// Exercise 3: groups packages into stages that can build in parallel. The first stage holds the
// packages with no dependencies, and each later stage only depends on earlier stages.
// Names inside a stage are sorted. Throws on a cycle or on a dependency that is not in the list.
export function buildStages(pkgs: Map<string, string[]>): string[][] {
  throw new Error("not implemented");
}
