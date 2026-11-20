// Prints Figures 1, 2, 4, 5 and 6 of the module: node trace-demo.ts
// Each walk is the walk of teamsUnderBudget, subsets, subsetsByChoice, orderings or combinations
// with a print added, and what it records is checked against the real function.
import assert from "node:assert/strict";
import { type Candidate } from "./opening-slow.ts";
import { teamsUnderBudget } from "./opening-fast.ts";
import { subsets, subsetsByChoice, orderings, combinations } from "./shapes.ts";

const cands: Candidate[] = [
  { name: "Ana", cost: 300 },
  { name: "Bo", cost: 200 },
  { name: "Cy", cost: 500 },
  { name: "Di", cost: 400 },
];
const budget = 700;
const sorted = cands.toSorted((a, b) => a.cost - b.cost);

const indent = (depth: number) => "    ".repeat(depth);

console.log("Figure 1: the search tree of teamsUnderBudget, budget 700\n");
{
  const teams: string[][] = [];
  const path: string[] = [];
  console.log(`(start) left ${budget}`);
  function explore(start: number, left: number, depth: number): void {
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i].cost > left) {
        console.log(`${indent(depth)}+-- ${sorted[i].name} ${sorted[i].cost} > ${left}: break`);
        break;
      }
      path.push(sorted[i].name);
      teams.push([...path]);
      console.log(`${indent(depth)}+-- [${path.join(", ")}] left ${left - sorted[i].cost}`);
      explore(i + 1, left - sorted[i].cost, depth + 1);
      path.pop();
    }
  }
  explore(0, budget, 0);
  assert.deepEqual(teams, teamsUnderBudget(cands, budget));
}

console.log("\nFigure 2: the path array during the same walk\n");
{
  const teams: string[][] = [];
  const path: string[] = [];
  let step = 0;
  const row = (action: string, left: number) =>
    console.log(`${String(++step).padEnd(5)}${action.padEnd(20)}${("[" + path.join(", ") + "]").padEnd(17)}${left}`);
  console.log("step action              path             left");
  function explore(start: number, left: number): void {
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i].cost > left) {
        row(`${sorted[i].name} too dear: break`, left);
        break;
      }
      path.push(sorted[i].name);
      teams.push([...path]);
      row(`choose ${sorted[i].name}, record`, left - sorted[i].cost);
      explore(i + 1, left - sorted[i].cost);
      path.pop();
      row(`undo ${sorted[i].name}`, left);
    }
  }
  explore(0, budget);
  assert.deepEqual(teams, teamsUnderBudget(cands, budget));
}

const abc = ["a", "b", "c"];
const label = (p: string[]) => (p.length ? p.join("") : "{}");

console.log("\nFigure 4: two search trees for the subsets of a, b, c\n");
{
  const left: string[] = [];
  const out: string[][] = [];
  const path: string[] = [];
  function explore(start: number, depth: number): void {
    out.push([...path]);
    left.push("  ".repeat(depth) + label(path));
    for (let i = start; i < abc.length; i++) {
      path.push(abc[i]);
      explore(i + 1, depth + 1);
      path.pop();
    }
  }
  explore(0, 0);
  assert.deepEqual(out, subsets(abc));

  const right: string[] = [];
  const out2: string[][] = [];
  function choose(i: number, depth: number, how: string): void {
    const leaf = i === abc.length;
    right.push("  ".repeat(depth) + how + label(path) + (leaf ? "  *" : ""));
    if (leaf) { out2.push([...path]); return; }
    path.push(abc[i]);
    choose(i + 1, depth + 1, `take ${abc[i]}: `);
    path.pop();
    choose(i + 1, depth + 1, `skip ${abc[i]}: `);
  }
  choose(0, 0, "");
  assert.deepEqual(out2, subsetsByChoice(abc));

  console.log(`loop from start: ${left.length} nodes, every node is a subset\n`);
  for (const line of left) console.log(line);
  console.log(`\none level per item: ${right.length} nodes, the leaves (*) are the subsets\n`);
  for (const line of right) console.log(line);
}

console.log("\nFigure 5: the search tree of orderings(a, b, c), one line per level\n");
{
  const levels: string[][] = [[], [], [], []];
  const out: string[][] = [];
  const path: string[] = [];
  const used = [false, false, false];
  function explore(): void {
    levels[path.length].push(label(path));
    if (path.length === abc.length) { out.push([...path]); return; }
    for (let i = 0; i < abc.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(abc[i]);
      explore();
      path.pop();
      used[i] = false;
    }
  }
  explore();
  assert.deepEqual(out, orderings(abc));
  levels.forEach((l, d) => console.log(`depth ${d}  ${String(l.length).padStart(2)} node${l.length === 1 ? " " : "s"}  ${l.join(" ")}`));
}

console.log("\nFigure 6: combinations(a, b, c, d; k = 3), with and without the prune\n");
{
  const abcd = ["a", "b", "c", "d"];
  const k = 3;
  for (const prune of [false, true]) {
    const visited: string[] = [];
    const out: string[][] = [];
    const path: string[] = [];
    function explore(start: number): void {
      const full = path.length === k;
      const dead = !full && abcd.length - start < k - path.length; // too few items left to finish
      visited.push(label(path) + (full ? "*" : dead ? "x" : ""));
      if (full) { out.push([...path]); return; }
      const last = prune ? abcd.length - (k - path.length) : abcd.length - 1;
      for (let i = start; i <= last; i++) {
        path.push(abcd[i]);
        explore(i + 1);
        path.pop();
      }
    }
    explore(0);
    assert.deepEqual(out, combinations(abcd, k));
    console.log(`${prune ? "prune   " : "no prune"}  ${String(visited.length).padStart(2)} nodes: ${visited.join(" ")}`);
  }
  console.log("(* = a group of 3, x = a dead end: too few items left)");
}
