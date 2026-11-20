// Opening problem: every team of candidates whose total daily cost fits a budget. The slow versions: node opening-slow.ts
import { bench } from "./bench.ts";

// A candidate has a unique name and a daily cost.
export type Candidate = { name: string; cost: number };

// n candidates with daily costs from 100 to 999.
export function makeCandidates(n: number): Candidate[] {
  return Array.from({ length: n }, (_, i) => ({ name: `c${i}`, cost: 100 + Math.floor(Math.random() * 900) }));
}

// Teams of exactly three: one loop per member. O(n^3) time. A team of four needs a fourth loop.
export function teamsOfThree(cands: Candidate[], budget: number): string[][] {
  const teams: string[][] = [];
  for (let a = 0; a < cands.length; a++)
    for (let b = a + 1; b < cands.length; b++)
      for (let c = b + 1; c < cands.length; c++)
        if (cands[a].cost + cands[b].cost + cands[c].cost <= budget)
          teams.push([cands[a].name, cands[b].name, cands[c].name]);
  return teams;
}

// Teams of any size: build every subset by doubling a list, then keep the ones that fit.
// O(2^n * n) time and memory: all 2^n subsets exist at once, even those far over budget.
export function allTeamsBrute(cands: Candidate[], budget: number): string[][] {
  let subsets: Candidate[][] = [[]];
  for (const c of cands) subsets = subsets.concat(subsets.map((s) => [...s, c])); // doubles each time
  return subsets
    .filter((s) => s.length > 0 && s.reduce((sum, c) => sum + c.cost, 0) <= budget)
    .map((s) => s.map((c) => c.name));
}

if (process.argv[1] === import.meta.filename) {
  const cands: Candidate[] = [
    { name: "Ana", cost: 300 },
    { name: "Bo", cost: 200 },
    { name: "Cy", cost: 500 },
    { name: "Di", cost: 400 },
  ];
  console.log("teamsOfThree, budget 1000:", JSON.stringify(teamsOfThree(cands, 1000)));
  console.log("allTeamsBrute, budget 700: ", JSON.stringify(allTeamsBrute(cands, 700)));
  bench("allTeamsBrute, budget 1500", [16, 18, 20], (n) => makeCandidates(n), (cs) => allTeamsBrute(cs, 1500));
}
