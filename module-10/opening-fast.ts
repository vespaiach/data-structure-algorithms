// Every team under a budget with backtracking: node opening-fast.ts
import { bench } from "./bench.ts";
import { type Candidate, makeCandidates, allTeamsBrute } from "./opening-slow.ts";

// Choose a candidate, explore every team that includes it, undo the choice.
// O(n log n) to sort, then O(T * n) for T teams under budget: every node of the
// search tree is a team, copied once (up to n names). O(n) memory besides the output.
export function teamsUnderBudget(cands: Candidate[], budget: number): string[][] {
  const sorted = cands.toSorted((a, b) => a.cost - b.cost);
  const teams: string[][] = [];
  const path: string[] = [];

  function explore(start: number, left: number): void {
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i].cost > left) break; // sorted: every later candidate costs more
      path.push(sorted[i].name); // choose
      teams.push([...path]); // record a copy: path keeps changing
      explore(i + 1, left - sorted[i].cost); // explore
      path.pop(); // undo
    }
  }

  explore(0, budget);
  return teams;
}

if (process.argv[1] === import.meta.filename) {
  const cands: Candidate[] = [
    { name: "Ana", cost: 300 },
    { name: "Bo", cost: 200 },
    { name: "Cy", cost: 500 },
    { name: "Di", cost: 400 },
  ];
  console.log("teamsUnderBudget, budget 700:", JSON.stringify(teamsUnderBudget(cands, 700)));

  // Compare as sets of teams: the two versions list teams in different orders.
  const key = (teams: string[][]) => teams.map((t) => t.toSorted().join(",")).sort().join(" ");
  let same = true;
  for (let t = 0; t < 50; t++) {
    const cs = makeCandidates(12);
    if (key(teamsUnderBudget(cs, 1500)) !== key(allTeamsBrute(cs, 1500))) same = false;
  }
  console.log("same teams as allTeamsBrute on 50 random lists:", same);

  for (const n of [20, 40, 80]) {
    const counts = Array.from({ length: 5 }, () => teamsUnderBudget(makeCandidates(n), 1500).length);
    console.log(`n = ${n}: teams under 1500 in 5 random lists: ${counts.join(", ")}`);
  }

  const tight = (n: number) => makeCandidates(n);
  bench("allTeamsBrute, budget 1500", [16, 18, 20], tight, (cs) => allTeamsBrute(cs, 1500));
  bench("teamsUnderBudget, budget 1500", [16, 18, 20], tight, (cs) => teamsUnderBudget(cs, 1500));
  bench("teamsUnderBudget, budget 1500, more candidates", [20, 40, 80], tight, (cs) => teamsUnderBudget(cs, 1500));
  bench("teamsUnderBudget, no budget limit (every team fits)", [16, 18, 20], tight, (cs) => teamsUnderBudget(cs, Infinity));
}
