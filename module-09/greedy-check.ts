// Is a greedy rule safe? Before trying to prove it, try to break it: node greedy-check.ts
// Run the rule against a brute force on many small random inputs, and print
// the first input where they disagree, made as small as possible.
import { type Meeting, mostMeetingsBrute, mostMeetings } from "./meetings.ts";

// A greedy rule: put the meetings in some order, take each one that fits.
function greedyBy(order: (ms: Meeting[]) => Meeting[]) {
  return (ms: Meeting[]): number => {
    const taken: Meeting[] = [];
    for (const m of order(ms)) if (taken.every(([s, e]) => m[1] <= s || e <= m[0])) taken.push(m);
    return taken.length;
  };
}
const overlaps = (a: Meeting, b: Meeting) => a[0] < b[1] && b[0] < a[1];
const rules: Record<string, (ms: Meeting[]) => number> = {
  "earliest start": greedyBy((ms) => ms.toSorted((a, b) => a[0] - b[0])),
  "shortest first": greedyBy((ms) => ms.toSorted((a, b) => a[1] - a[0] - (b[1] - b[0]))),
  "fewest overlaps": greedyBy((ms) => ms.toSorted((a, b) =>
    ms.filter((m) => m !== a && overlaps(m, a)).length - ms.filter((m) => m !== b && overlaps(m, b)).length)),
  "earliest end": (ms) => mostMeetings(ms).length,
};

function randomMeetings(): Meeting[] {
  const n = 1 + Math.floor(Math.random() * 8);
  return Array.from({ length: n }, (): Meeting => {
    const start = Math.floor(Math.random() * 20);
    return [start, start + 1 + Math.floor(Math.random() * 8)];
  });
}

// Shrink a counterexample: drop meetings one at a time while greedy still
// loses, so the printed input is small enough to check by hand.
function shrink(ms: Meeting[], rule: (ms: Meeting[]) => number): Meeting[] {
  for (let i = 0; i < ms.length; i++) {
    const smaller = ms.toSpliced(i, 1);
    if (rule(smaller) !== mostMeetingsBrute(smaller)) return shrink(smaller, rule);
  }
  return ms;
}

for (const [name, rule] of Object.entries(rules)) {
  let found = "no counterexample in 100,000 tries";
  for (let t = 0; t < 100_000; t++) {
    const ms = randomMeetings();
    const g = rule(ms), b = mostMeetingsBrute(ms);
    if (g !== b) {
      const small = shrink(ms, rule);
      found = `try ${t + 1}: ${JSON.stringify(small)} greedy ${rule(small)}, best ${mostMeetingsBrute(small)}`;
      break;
    }
  }
  console.log(`${name.padEnd(16)} ${found}`);
}

// The same check on change-making: fewest coins for an amount, taking the
// largest coin that fits each time.
function coinsGreedy(coins: number[], amount: number): number {
  let count = 0;
  for (const c of coins.toSorted((a, b) => b - a)) { count += Math.floor(amount / c); amount %= c; }
  return amount === 0 ? count : Infinity;
}
// The fewest coins for every amount from 1 up, each built from a smaller amount (Module 11 explains this table).
function coinsBest(coins: number[], amount: number): number {
  const best = [0];
  for (let a = 1; a <= amount; a++) best[a] = Math.min(...coins.map((c) => (c <= a ? best[a - c] + 1 : Infinity)));
  return best[amount];
}
for (const coins of [[1, 5, 10, 25], [1, 3, 4]]) {
  let found = "no counterexample for amounts 1..500";
  for (let amount = 1; amount <= 500; amount++) {
    if (coinsGreedy(coins, amount) !== coinsBest(coins, amount)) {
      found = `amount ${amount}: greedy ${coinsGreedy(coins, amount)} coins, best ${coinsBest(coins, amount)}`;
      break;
    }
  }
  console.log(`coins ${JSON.stringify(coins).padEnd(14)} ${found}`);
}
