// Tests for the reading code: node --test backtracking.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { type Candidate, makeCandidates, allTeamsBrute, teamsOfThree } from "./opening-slow.ts";
import { teamsUnderBudget } from "./opening-fast.ts";
import { subsets, subsetsByChoice, orderings, combinations } from "./shapes.ts";
import { eachSubset, subsetGen } from "./streaming.ts";

// A list of teams as one string, ignoring the order of teams and of names in a team.
const key = (xs: string[][]) => xs.map((t) => t.toSorted().join(",")).sort().join(" ");
const letters = (n: number) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + i));

test("teamsUnderBudget finds the same teams as allTeamsBrute", () => {
  for (let t = 0; t < 30; t++) {
    const cands = makeCandidates(1 + Math.floor(Math.random() * 12));
    for (const budget of [0, 150, 1500, 4000, Infinity]) {
      assert.equal(key(teamsUnderBudget(cands, budget)), key(allTeamsBrute(cands, budget)), JSON.stringify({ cands, budget }));
    }
  }
});

test("budget 0, no candidates, and a budget below every cost give no teams", () => {
  const cands = makeCandidates(8);
  assert.deepEqual(teamsUnderBudget(cands, 0), []);
  assert.deepEqual(teamsUnderBudget([], 1000), []);
  assert.deepEqual(teamsUnderBudget([{ name: "A", cost: 300 }], 299), []);
  assert.deepEqual(allTeamsBrute([], 1000), []);
});

test("a cost equal to what is left fits, and equal costs are separate candidates", () => {
  const cands: Candidate[] = [{ name: "A", cost: 200 }, { name: "B", cost: 200 }, { name: "C", cost: 300 }];
  assert.equal(key(teamsUnderBudget(cands, 400)), key([["A"], ["B"], ["C"], ["A", "B"]]));
});

test("teamsUnderBudget leaves the input in its order", () => {
  const cands = makeCandidates(10);
  const copy = structuredClone(cands);
  teamsUnderBudget(cands, 1500);
  assert.deepEqual(cands, copy);
});

test("teamsOfThree keeps only teams of three under budget", () => {
  const cands = makeCandidates(9);
  const expected = allTeamsBrute(cands, 1500).filter((t) => t.length === 3);
  assert.equal(key(teamsOfThree(cands, 1500)), key(expected));
});

test("subsets and subsetsByChoice: 2^n different subsets, the empty list has one", () => {
  assert.deepEqual(subsets([]), [[]]);
  assert.deepEqual(subsetsByChoice([]), [[]]);
  for (let n = 1; n <= 10; n++) {
    const a = subsets(letters(n)), b = subsetsByChoice(letters(n));
    assert.equal(a.length, 2 ** n);
    assert.equal(new Set(a.map((s) => s.join(""))).size, 2 ** n);
    assert.equal(key(a), key(b));
  }
});

test("orderings: n! different orders, the empty list has one", () => {
  assert.deepEqual(orderings([]), [[]]);
  let f = 1;
  for (let n = 1; n <= 7; n++) {
    f *= n;
    const out = orderings(letters(n));
    assert.equal(out.length, f);
    assert.equal(new Set(out.map((s) => s.join(""))).size, f);
    assert.ok(out.every((o) => o.toSorted().join("") === letters(n).join("")));
  }
});

test("combinations: the subsets of size k, with k = 0, k = n and k > n", () => {
  assert.deepEqual(combinations(["a", "b"], 0), [[]]);
  assert.deepEqual(combinations(["a", "b"], 2), [["a", "b"]]);
  assert.deepEqual(combinations(["a", "b"], 3), []);
  assert.deepEqual(combinations([], 0), [[]]);
  for (let n = 0; n <= 8; n++)
    for (let k = 0; k <= n; k++)
      assert.equal(key(combinations(letters(n), k)), key(subsets(letters(n)).filter((s) => s.length === k)));
});

test("eachSubset and subsetGen visit the same subsets as subsets", () => {
  const xs = [1, 2, 3, 4, 5];
  const seen: number[][] = [];
  eachSubset(xs, (p) => seen.push([...p]));
  assert.deepEqual(seen, subsets(xs));
  assert.deepEqual(Array.from(subsetGen(xs), (p) => [...p]), subsets(xs));
  assert.deepEqual(Array.from(subsetGen([]), (p) => [...p]), [[]]);
});
