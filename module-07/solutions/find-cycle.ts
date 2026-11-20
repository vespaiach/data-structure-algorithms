// Exercise 4: one dependency cycle as a list of names that starts and ends with the same
// package (["api", "auth", "api"]), or null if there is none.
// It must work on a chain of 100,000 packages.
// Depth first with three states and no recursion: `path` is the current path, and next[i] is the
// index of the next dependency to try for path[i] (two parallel stacks).
// O(V + E) time, O(V) memory.
export function findCycle(pkgs: Map<string, string[]>): string[] | null {
  const state = new Map<string, "path" | "done">();
  for (const root of pkgs.keys()) {
    if (state.has(root)) continue;
    const path = [root];
    const next = [0];
    state.set(root, "path");
    while (path.length > 0) {
      const top = path.length - 1;
      const deps = pkgs.get(path[top]) ?? [];
      if (next[top] === deps.length) {
        state.set(path[top], "done"); // every dependency is done
        path.pop();
        next.pop();
        continue;
      }
      const d = deps[next[top]++];
      const s = state.get(d);
      if (s === "path") return [...path.slice(path.indexOf(d)), d]; // the path came back to d
      if (s === undefined) {
        state.set(d, "path");
        path.push(d);
        next.push(0);
      }
    }
  }
  return null;
}
