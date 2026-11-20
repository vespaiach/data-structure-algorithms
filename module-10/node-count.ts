// Count the nodes of each search tree and compare them with the formulas: node node-count.ts
// Each counter is the matching function of shapes.ts with the output replaced by a count,
// and its leaf count is checked against the real function for small n.
import assert from "node:assert/strict";
import { subsets, subsetsByChoice, orderings, combinations } from "./shapes.ts";

// "Loop from start": every node is a subset.
function subsetNodes(n: number): number {
  let nodes = 0;
  function explore(start: number): void {
    nodes++;
    for (let i = start; i < n; i++) explore(i + 1);
  }
  explore(0);
  return nodes;
}

// "One level per item": a full binary tree of depth n.
function byChoiceNodes(n: number): { nodes: number; leaves: number } {
  let nodes = 0, leaves = 0;
  function explore(i: number): void {
    nodes++;
    if (i === n) { leaves++; return; }
    explore(i + 1); // take
    explore(i + 1); // skip
  }
  explore(0);
  return { nodes, leaves };
}

// Orderings: level d has n! / (n - d)! nodes.
function orderingNodes(n: number): { nodes: number; leaves: number } {
  let nodes = 0, leaves = 0;
  const used = new Array<boolean>(n).fill(false);
  function explore(depth: number): void {
    nodes++;
    if (depth === n) { leaves++; return; }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      explore(depth + 1);
      used[i] = false;
    }
  }
  explore(0);
  return { nodes, leaves };
}

// Combinations of size k, with or without the "leave room for the rest" prune.
function combinationNodes(n: number, k: number, prune: boolean): { nodes: number; leaves: number } {
  let nodes = 0, leaves = 0;
  function explore(start: number, size: number): void {
    nodes++;
    if (size === k) { leaves++; return; }
    const last = prune ? n - (k - size) : n - 1;
    for (let i = start; i <= last; i++) explore(i + 1, size + 1);
  }
  explore(0, 0);
  return { nodes, leaves };
}

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
const choose = (n: number, k: number): number => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};
const letters = (n: number) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + i));

// The counters describe the real functions: same number of results for small n.
for (let n = 0; n <= 6; n++) {
  assert.equal(subsetNodes(n), subsets(letters(n)).length);
  assert.equal(byChoiceNodes(n).leaves, subsetsByChoice(letters(n)).length);
  assert.equal(orderingNodes(n).leaves, orderings(letters(n)).length);
  for (let k = 0; k <= n; k++) {
    assert.equal(combinationNodes(n, k, true).leaves, combinations(letters(n), k).length);
    assert.equal(combinationNodes(n, k, false).leaves, combinations(letters(n), k).length);
  }
}

const fmt = (x: number) => x.toLocaleString("en-US");
console.log("subsets         n   nodes (loop from start)   nodes (one level per item)   2^n");
for (const n of [3, 10, 20]) {
  console.log(`${String(n).padStart(17)}${fmt(subsetNodes(n)).padStart(26)}${fmt(byChoiceNodes(n).nodes).padStart(29)}${fmt(2 ** n).padStart(12)}`);
}

console.log("\norderings       n   nodes        leaves       n!           nodes / n!");
for (const n of [3, 8, 10]) {
  const { nodes, leaves } = orderingNodes(n);
  console.log(`${String(n).padStart(17)}   ${fmt(nodes).padEnd(13)}${fmt(leaves).padEnd(13)}${fmt(factorial(n)).padEnd(13)}${(nodes / factorial(n)).toFixed(4)}`);
}

console.log("\ncombinations    n   k   C(n, k)    nodes, no prune   nodes, prune");
for (const [n, k] of [[5, 3], [20, 3], [20, 10]]) {
  const a = combinationNodes(n, k, false), b = combinationNodes(n, k, true);
  assert.equal(a.leaves, b.leaves);
  console.log(`${String(n).padStart(17)}${String(k).padStart(4)}   ${fmt(choose(n, k)).padEnd(11)}${fmt(a.nodes).padEnd(18)}${fmt(b.nodes)}`);
}

console.log("\n n     2^n             n!");
for (const n of [10, 15, 20, 25, 30]) console.log(`${String(n).padStart(2)}    ${fmt(2 ** n).padEnd(16)}${factorial(n).toExponential(2)}`);
