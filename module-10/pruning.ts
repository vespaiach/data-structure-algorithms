// How much work pruning saves: count the candidates each version looks at: node pruning.ts
import { type Candidate, makeCandidates } from "./opening-slow.ts";
import { teamsUnderBudget } from "./opening-fast.ts";

// No pruning: explore every subset, check the budget only when recording.
function noPrune(cands: Candidate[], budget: number): { teams: number; looks: number } {
  let teams = 0;
  let looks = 0;
  function explore(start: number, cost: number): void {
    for (let i = start; i < cands.length; i++) {
      looks++;
      const next = cost + cands[i].cost;
      if (next <= budget) teams++;
      explore(i + 1, next); // keeps going even when already over budget
    }
  }
  explore(0, 0);
  return { teams, looks };
}

// Prune with `continue`: skip a candidate that does not fit, but still look at every later one.
function pruneSkip(cands: Candidate[], budget: number): { teams: number; looks: number } {
  let teams = 0;
  let looks = 0;
  function explore(start: number, left: number): void {
    for (let i = start; i < cands.length; i++) {
      looks++;
      if (cands[i].cost > left) continue;
      teams++;
      explore(i + 1, left - cands[i].cost);
    }
  }
  explore(0, budget);
  return { teams, looks };
}

// Sort first, then `break`: the first candidate that does not fit ends the loop.
function pruneSorted(cands: Candidate[], budget: number): { teams: number; looks: number } {
  const sorted = [...cands].sort((a, b) => a.cost - b.cost);
  let teams = 0;
  let looks = 0;
  function explore(start: number, left: number): void {
    for (let i = start; i < sorted.length; i++) {
      looks++;
      if (sorted[i].cost > left) break;
      teams++;
      explore(i + 1, left - sorted[i].cost);
    }
  }
  explore(0, budget);
  return { teams, looks };
}

console.log("n   budget  teams   no prune         continue     sort + break");
for (const n of [16, 20]) {
  const cands = makeCandidates(n);
  for (const budget of [1500, 3000]) {
    const a = noPrune(cands, budget);
    const b = pruneSkip(cands, budget);
    const c = pruneSorted(cands, budget);
    if (a.teams !== b.teams || b.teams !== c.teams || c.teams !== teamsUnderBudget(cands, budget).length)
      throw new Error("versions disagree");
    const f = (x: number) => x.toLocaleString("en-US");
    console.log(`${String(n).padEnd(4)}${String(budget).padEnd(8)}${f(a.teams).padEnd(8)}${f(a.looks).padEnd(17)}${f(b.looks).padEnd(13)}${f(c.looks)}`);
  }
}
