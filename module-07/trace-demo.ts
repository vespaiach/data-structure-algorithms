// Prints Figures 2, 3, 5, 6, 8 and 9 of the module: node trace-demo.ts
// The loops are the loops of buildOrderKahn, allDeps, fewestSteps and buildOrderDfs with a print added,
// and each result is checked against the real function.
import assert from "node:assert/strict";
import { Deque } from "./deque.ts";
import type { Packages } from "./packages.ts";
import { buildOrderKahn } from "./opening-fast.ts";
import { allDeps } from "./needs.ts";
import { fewestSteps, type Grid } from "./grid.ts";
import { buildOrderDfs } from "./variations.ts";

const project: Packages = new Map([
  ["app", ["ui", "api"]],
  ["ui", ["core"]],
  ["api", ["core", "db"]],
  ["db", []],
  ["core", []],
]);
const list = (a: string[]) => a.join(", ") || "-";

// The first loop of buildOrderKahn.
const dependents = new Map<string, string[]>();
const waiting = new Map<string, number>();
for (const [name, deps] of project) {
  waiting.set(name, deps.length);
  for (const d of deps) dependents.getOrInsertComputed(d, () => []).push(name);
}

console.log("Figure 2: the edges in both directions\n");
console.log("package   needs      needed by   waiting");
for (const [name, deps] of project) {
  console.log(name.padEnd(10) + list(deps).padEnd(11) + list(dependents.get(name) ?? []).padEnd(12) + waiting.get(name));
}

console.log("\nFigure 3: buildOrderKahn(project)\n");
console.log("take    counts lowered          order, queue part in [ ]");
{
  const order: string[] = [];
  for (const [name, count] of waiting) if (count === 0) order.push(name);
  const row = (take: string, lowered: string[], head: number) =>
    console.log(take.padEnd(8) + list(lowered).padEnd(24) + [...order.slice(0, head), `[${order.slice(head).join(" ")}]`].join(" "));
  row("start", [], 0);
  for (let head = 0; head < order.length; head++) {
    const lowered: string[] = [];
    for (const next of dependents.get(order[head]) ?? []) {
      const left = waiting.get(next)! - 1;
      lowered.push(`${next} ${left + 1}->${left}`);
      waiting.set(next, left);
      if (left === 0) order.push(next);
    }
    row(order[head], lowered, head + 1);
  }
  assert.deepEqual(order, buildOrderKahn(project));
}

console.log("\nFigure 5: allDeps(project, \"app\")\n");
console.log("step       stack, top on the right   seen");
{
  const seen = new Set<string>(["app"]);
  const stack = ["app"];
  const row = (step: string, skipped: string[]) =>
    console.log(step.padEnd(11) + `[${stack.join(" ")}]`.padEnd(26) + [...seen].join(" ") + (skipped.length ? `   (${skipped.join(", ")} seen: skip)` : ""));
  row("start", []);
  while (stack.length > 0) {
    const pkg = stack.pop()!;
    const skipped: string[] = [];
    for (const d of project.get(pkg) ?? []) {
      if (seen.has(d)) {
        skipped.push(d);
        continue;
      }
      seen.add(d);
      stack.push(d);
    }
    row(`pop ${pkg}`, skipped);
  }
  seen.delete("app");
  assert.deepEqual([...seen], allDeps(project, "app"));
}

console.log("\nFigure 6: fewestSteps on a 4 x 4 floor, steps to each cell\n");
{
  const floor: Grid = ["...#", ".#..", ".#.#", "...."];
  const rows = floor.length, cols = floor[0].length;
  const dist = new Int32Array(rows * cols).fill(-1);
  const queue = new Deque<number>();
  dist[0] = 0;
  queue.push(0);
  while (queue.size > 0) {
    const cell = queue.shift()!;
    const r = Math.floor(cell / cols), c = cell % cols;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || floor[nr][nc] === "#") continue;
      if (dist[nr * cols + nc] !== -1) continue;
      dist[nr * cols + nc] = dist[cell] + 1;
      queue.push(nr * cols + nc);
    }
  }
  for (let r = 0; r < rows; r++) {
    const cells = [...floor[r]].map((ch, c) => (ch === "#" ? "#" : String(dist[r * cols + c])));
    console.log(floor[r].padEnd(8) + cells.join(" "));
  }
  assert.equal(dist[rows * cols - 1], fewestSteps(floor));
}

console.log("\nFigure 8: buildOrderDfs(project)\n");
console.log("step            path, bottom on the left   order");
{
  const state = new Map<string, "path" | "done">();
  const order: string[] = [];
  const path: string[] = [];
  const row = (step: string) => console.log(step.padEnd(16) + (path.join(" > ") || "(empty)").padEnd(27) + list(order));
  function visit(name: string): void {
    const s = state.get(name);
    if (s === "done") {
      row(`${name} is done`);
      return;
    }
    state.set(name, "path");
    path.push(name);
    row(`visit ${name}`);
    for (const d of project.get(name)!) visit(d);
    state.set(name, "done");
    order.push(name);
    path.pop();
    row(`${name} done`);
  }
  for (const name of project.keys()) if (state.get(name) !== "done") visit(name);
  assert.deepEqual(order, buildOrderDfs(project));
}

console.log("\nFigure 9: the same graph as an adjacency matrix (row needs column)\n");
{
  const names = [...project.keys()];
  const matrix = new Uint8Array(names.length * names.length);
  names.forEach((name, a) => {
    for (const d of project.get(name)!) matrix[a * names.length + names.indexOf(d)] = 1;
  });
  console.log("".padEnd(6) + names.map((x) => x.padStart(5)).join(""));
  names.forEach((name, a) => console.log(name.padEnd(6) + names.map((_, b) => String(matrix[a * names.length + b]).padStart(5)).join("")));
}
