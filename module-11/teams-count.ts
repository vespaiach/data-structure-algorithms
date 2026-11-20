// Count (not list) the teams that fit a daily budget, from Module 10's opening: node teams-count.ts
import assert from "node:assert/strict";
import { bench } from "./bench.ts";
import { type Candidate, makeCandidates, allTeamsBrute } from "../module-10/opening-slow.ts";

// Backtracking, as in Module 10, but counting: sort, then break at the first candidate that costs
// too much. One step per team that fits: O(n log n + T) time for T teams, O(n) memory.
export function countTeamsSearch(cands: Candidate[], budget: number): number {
  const costs = cands.map((c) => c.cost).sort((a, b) => a - b);
  let count = 0;
  function explore(start: number, left: number): void {
    for (let i = start; i < costs.length; i++) {
      if (costs[i] > left) break;
      count++; // the path plus costs[i] is a team that fits
      explore(i + 1, left - costs[i]);
    }
  }
  explore(0, budget);
  return count;
}

// The state: which candidate is next (i) and how much money is left. teams(i, left) counts the
// teams, the empty one included, that candidates i..n-1 can form within left.
// teams(i, left) = teams(i + 1, left) + teams(i + 1, left - cost[i]) when cost[i] <= left.
// At most n * (budget + 1) states, O(1) work each: O(n * B) time and memory for B = budget.
export function countTeamsMemo(cands: Candidate[], budget: number): number {
  const memo = new Map<number, number>();
  function teams(i: number, left: number): number {
    if (i === cands.length) return 1; // no candidates left: only the empty team
    const key = i * (budget + 1) + left; // unique, because 0 <= left <= budget
    const known = memo.get(key);
    if (known !== undefined) return known;
    let result = teams(i + 1, left); // skip candidate i
    if (cands[i].cost <= left) result += teams(i + 1, left - cands[i].cost); // take candidate i
    memo.set(key, result);
    return result;
  }
  return teams(0, budget) - 1; // the empty team is not a team
}

// The same states in a table, filled from the last candidate up. O(n * B) time and memory.
export function countTeamsTable(cands: Candidate[], budget: number): number {
  const n = cands.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(budget + 1).fill(0));
  table[n].fill(1); // no candidates left: only the empty team
  for (let i = n - 1; i >= 0; i--)
    for (let left = 0; left <= budget; left++)
      table[i][left] = table[i + 1][left] + (cands[i].cost <= left ? table[i + 1][left - cands[i].cost] : 0);
  return table[0][budget] - 1;
}

// One row instead of the table: row i needs only row i + 1. Go from the largest left down, so
// row[left - cost] still holds row i + 1's value when it is read. O(n * B) time, O(B) memory.
export function countTeamsRow(cands: Candidate[], budget: number): number {
  const row = new Array<number>(budget + 1).fill(1);
  for (let i = cands.length - 1; i >= 0; i--)
    for (let left = budget; left >= cands[i].cost; left--) row[left] += row[left - cands[i].cost];
  return row[budget] - 1;
}

let sink = 0;

if (process.argv[1] === import.meta.filename) {
  const cands: Candidate[] = [
    { name: "Ana", cost: 300 },
    { name: "Bo", cost: 200 },
    { name: "Cy", cost: 500 },
    { name: "Di", cost: 400 },
  ];
  console.log("teams under 700:", [countTeamsSearch, countTeamsMemo, countTeamsTable, countTeamsRow].map((f) => f(cands, 700)).join(", "));

  for (let t = 0; t < 50; t++) {
    const cs = makeCandidates(12);
    const expected = allTeamsBrute(cs, 1500).length;
    for (const f of [countTeamsSearch, countTeamsMemo, countTeamsTable, countTeamsRow]) assert.equal(f(cs, 1500), expected);
  }
  console.log("same counts as allTeamsBrute on 50 random lists: true");

  for (const n of [20, 40, 80]) {
    const counts = Array.from({ length: 5 }, () => countTeamsRow(makeCandidates(n), 3000));
    console.log(`n = ${n}: teams under 3000 in 5 random lists: ${counts.map((c) => c.toLocaleString("en-US")).join(", ")}`);
  }

  const sizes = [20, 30, 40];
  bench("countTeamsSearch, budget 3000", sizes, makeCandidates, (cs) => (sink += countTeamsSearch(cs, 3000)));
  bench("countTeamsMemo, budget 3000", sizes, makeCandidates, (cs) => (sink += countTeamsMemo(cs, 3000)));
  bench("countTeamsTable, budget 3000", sizes, makeCandidates, (cs) => (sink += countTeamsTable(cs, 3000)));
  bench("countTeamsRow, budget 3000", sizes, makeCandidates, (cs) => (sink += countTeamsRow(cs, 3000)));
  bench("countTeamsRow, budget 3000, more candidates", [40, 80, 160], makeCandidates, (cs) => (sink += countTeamsRow(cs, 3000)));
  bench("countTeamsRow, 80 candidates, budget B", [3_000, 30_000, 300_000], (b) => ({ cs: makeCandidates(80), b }), ({ cs, b }) => (sink += countTeamsRow(cs, b)));
  if (sink === 0) console.log(sink);
}
