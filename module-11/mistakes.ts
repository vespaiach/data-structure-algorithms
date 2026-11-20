// Six dynamic programming bugs and the wrong output (or cost) each one produces: node mistakes.ts
import { countTeamsRow } from "./teams-count.ts";

// 1. Wrong base case: ways(0) = 0 instead of 1 shifts every answer.
const waysBadBase = (n: number): number => (n <= 1 ? n : waysBadBase(n - 1) + waysBadBase(n - 2));
console.log("1. ways(0) = 0, n = 1..5:", [1, 2, 3, 4, 5].map(waysBadBase), "(correct: [1, 2, 3, 5, 8])");

// 2. Truthiness check on the memo: a stored 0 looks like "not stored", so every state whose
// answer is 0 is solved again. The opening problem with steps of 4 or 6: an odd n has 0 ways.
function waysFourSix(n: number, truthy: boolean): { ways: number; calls: number } {
  const memo = new Map<number, number>();
  let calls = 0;
  function ways(k: number): number {
    calls++;
    if (k === 0) return 1;
    if (k < 0) return 0;
    if (truthy) {
      if (memo.get(k)) return memo.get(k)!; // bug: a stored 0 is falsy
    } else {
      const known = memo.get(k);
      if (known !== undefined) return known; // fix: compare with undefined
    }
    const result = ways(k - 4) + ways(k - 6);
    memo.set(k, result);
    return result;
  }
  return { ways: ways(n), calls };
}
console.log("2. truthy memo check, n = 101:", waysFourSix(101, true), " fixed:", waysFourSix(101, false));

// 3. A string key without a separator: (1, 11) and (11, 1) both become "111".
const keys = new Map<string, string>();
for (const [r, c] of [[1, 11], [11, 1]]) {
  const k = `${r}${c}`;
  console.log(`3. key for (${r}, ${c}) = "${k}"`, keys.has(k) ? `collides with (${keys.get(k)})` : "");
  keys.set(k, `${r}, ${c}`);
}

// 4. A new memo on every call: nothing is shared, so the cost stays exponential.
let calls4 = 0;
function waysFreshMemo(n: number): number {
  calls4++;
  const memo = new Map<number, number>(); // bug: should be created once, outside
  if (n <= 1) return 1;
  if (memo.has(n)) return memo.get(n)!;
  const r = waysFreshMemo(n - 1) + waysFreshMemo(n - 2);
  memo.set(n, r);
  return r;
}
waysFreshMemo(25);
const freshCalls = calls4;
calls4 = 0;
const shared = new Map<number, number>();
function waysSharedMemo(n: number): number {
  calls4++;
  if (n <= 1) return 1;
  if (shared.has(n)) return shared.get(n)!;
  const r = waysSharedMemo(n - 1) + waysSharedMemo(n - 2);
  shared.set(n, r);
  return r;
}
waysSharedMemo(25);
console.log("4. new Map in every call, n = 25:", freshCalls, "calls; one shared Map:", calls4, "calls");

// 5. Table one slot too short.
function waysShortTable(n: number): number {
  const t = new Array<number>(n); // bug: needs n + 1 slots for t[n]
  t[0] = 1;
  t[1] = 1;
  for (let i = 2; i < n; i++) t[i] = t[i - 1] + t[i - 2];
  return t[n];
}
console.log("5. table of length n, n = 10:", waysShortTable(10), "(correct: 89)");

// 6. One row filled from the smallest left up: row[left - cost] already holds this candidate's
// new value, so the same candidate joins a team twice.
function countTeamsRowForward(costs: number[], budget: number): number {
  const row = new Array<number>(budget + 1).fill(1);
  for (const cost of costs) for (let left = cost; left <= budget; left++) row[left] += row[left - cost]; // bug: low to high
  return row[budget] - 1;
}
const ana = [{ name: "Ana", cost: 300 }];
console.log("6. teams of [Ana 300] under 600, low to high:", countTeamsRowForward([300], 600), " high to low:", countTeamsRow(ana, 600));
