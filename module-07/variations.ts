// Two more shapes of a graph search: node variations.ts
import { Deque } from "./deque.ts";
import { makePackages, type Packages } from "./packages.ts";

// How many separate groups do servers 0 to n - 1 form, given two-way links between them?
// Breadth first from every server not seen yet; each walk finds one whole group.
// O(V + E) time and memory.
export function countGroups(n: number, links: [number, number][]): number {
  const neighbours: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of links) {
    neighbours[a].push(b);
    neighbours[b].push(a); // a two-way link is an edge in each direction
  }
  const seen = new Uint8Array(n);
  const queue = new Deque<number>();
  let groups = 0;
  for (let start = 0; start < n; start++) {
    if (seen[start]) continue;
    groups++; // a new group: walk all of it
    seen[start] = 1;
    queue.push(start);
    while (queue.size > 0) {
      for (const next of neighbours[queue.shift()!]) {
        if (seen[next]) continue;
        seen[next] = 1;
        queue.push(next);
      }
    }
  }
  return groups;
}

// The build order depth first: a package goes into the order after all of its dependencies.
// Each package is "path" while the walk is inside it, then "done". Reaching a package that is
// still on the path means the path has come back to it: a cycle.
// O(V + E) time, O(V) memory, but the recursion is as deep as the longest chain of dependencies.
export function buildOrderDfs(pkgs: Packages): string[] {
  const state = new Map<string, "path" | "done">();
  const order: string[] = [];
  function visit(name: string): void {
    const s = state.get(name);
    if (s === "done") return;
    if (s === "path") throw new Error(`cycle through ${name}`);
    state.set(name, "path");
    for (const d of pkgs.get(name)!) {
      if (!pkgs.has(d)) throw new Error(`${name} depends on ${d}, which is not in the list`);
      visit(d);
    }
    state.set(name, "done");
    order.push(name);
  }
  for (const name of pkgs.keys()) visit(name);
  return order;
}

if (process.argv[1] === import.meta.filename) {
  console.log("countGroups:", countGroups(7, [[0, 1], [1, 2], [2, 0], [3, 4], [5, 5]]));
  const project: Packages = new Map([
    ["app", ["ui", "api"]],
    ["ui", ["core"]],
    ["api", ["core", "db"]],
    ["db", []],
    ["core", []],
  ]);
  console.log("buildOrderDfs:", buildOrderDfs(project).join(" "));
  try {
    buildOrderDfs(new Map([["app", ["api"]], ["api", ["auth"]], ["auth", ["api"]]]));
  } catch (err) {
    console.log("with a cycle:", (err as Error).message);
  }
  try {
    buildOrderDfs(makePackages(20_000));
  } catch (err) {
    console.log("20,000 packages:", `${(err as Error).name}: ${(err as Error).message}`);
  }
}
