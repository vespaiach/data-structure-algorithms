// Tests for the code in the reading: node --test dp.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { waysSlow } from "./opening-slow.ts";
import { waysMemo, waysTable, waysTwoVars } from "./opening-fast.ts";
import { waysBig } from "./precision.ts";
import { waysInsert } from "./memo-insert.ts";
import { countTeamsSearch, countTeamsMemo, countTeamsTable, countTeamsRow } from "./teams-count.ts";
import { fewestCoins, lcsTable, lcsTwoRows, randomText } from "./variations.ts";
import { minCostStringKey, minCostNumberKey, minCostTable, minCostRow, makeCosts } from "./keys.ts";
import { type Candidate, makeCandidates, allTeamsBrute } from "../module-10/opening-slow.ts";

test("every ways version agrees, n = 0 to 77, and matches BigInt while the count is safe", () => {
  for (let n = 0; n <= 77; n++) {
    const exact = Number(waysBig(n));
    if (n <= 25) assert.equal(waysSlow(n), exact);
    assert.equal(waysMemo(n), exact);
    assert.equal(waysTable(n), exact);
    assert.equal(waysTwoVars(n), exact);
    assert.equal(waysInsert(n), exact);
  }
  assert.deepEqual([0, 1, 2, 3].map(waysTwoVars), [1, 1, 2, 3]);
});

test("team counts match Module 10's brute force, edge cases included", () => {
  const counts = [countTeamsSearch, countTeamsMemo, countTeamsTable, countTeamsRow];
  for (const f of counts) {
    assert.equal(f([], 1000), 0, f.name);
    assert.equal(f([{ name: "a", cost: 500 }], 0), 0, f.name);
    assert.equal(f([{ name: "a", cost: 500 }], 500), 1, f.name);
    assert.equal(f([{ name: "a", cost: 500 }, { name: "b", cost: 500 }], 1000), 3, f.name);
  }
  for (let t = 0; t < 100; t++) {
    const cs: Candidate[] = makeCandidates(Math.floor(Math.random() * 13));
    const budget = Math.floor(Math.random() * 3000);
    const expected = allTeamsBrute(cs, budget).length;
    for (const f of counts) assert.equal(f(cs, budget), expected, `${f.name} ${budget} ${JSON.stringify(cs)}`);
  }
});

test("fewestCoins: Module 9's counterexample, amount 0, impossible amounts, against a slow search", () => {
  assert.equal(fewestCoins([1, 3, 4], 6), 2);
  assert.equal(fewestCoins([1, 5, 10, 25], 0), 0);
  assert.equal(fewestCoins([4, 6], 7), -1);
  assert.equal(fewestCoins([], 3), -1);
  const slow = (coins: number[], a: number): number =>
    a === 0 ? 0 : Math.min(Infinity, ...coins.filter((c) => c <= a).map((c) => 1 + slow(coins, a - c)));
  for (let t = 0; t < 100; t++) {
    const coins = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => 2 + Math.floor(Math.random() * 6));
    const a = Math.floor(Math.random() * 20);
    const s = slow(coins, a);
    assert.equal(fewestCoins(coins, a), s === Infinity ? -1 : s, JSON.stringify({ coins, a }));
  }
});

test("LCS: the figure's example, empty strings, and the table against two rows", () => {
  assert.equal(lcsTable("deploy", "replay")[6][6], 4);
  assert.equal(lcsTwoRows("", "abc"), 0);
  assert.equal(lcsTwoRows("abc", ""), 0);
  assert.equal(lcsTwoRows("", ""), 0);
  assert.deepEqual(lcsTable("", ""), [[0]]);
  // Slow check: the longest subsequence of a that is also a subsequence of b, over all 2^m subsequences.
  const isSub = (s: string, b: string) => { let j = 0; for (const ch of b) if (j < s.length && s[j] === ch) j++; return j === s.length; };
  for (let t = 0; t < 200; t++) {
    const a = randomText(Math.floor(Math.random() * 9)), b = randomText(Math.floor(Math.random() * 9));
    let best = 0;
    for (let mask = 0; mask < 2 ** a.length; mask++) {
      const s = [...a].filter((_, i) => Math.floor(mask / 2 ** i) % 2 === 1).join("");
      if (s.length > best && isSub(s, b)) best = s.length;
    }
    assert.equal(lcsTable(a, b)[a.length][b.length], best, `${a} ${b}`);
    assert.equal(lcsTwoRows(a, b), best, `${a} ${b}`);
  }
});

test("cheapest grid path: the four versions agree, 1 x 1 and one-row grids included", () => {
  const all = [minCostStringKey, minCostNumberKey, minCostTable, minCostRow];
  for (const f of all) {
    assert.equal(f([[7]]), 7);
    assert.equal(f([[1, 2, 3]]), 6);
    assert.equal(f([[1], [2], [3]]), 6);
    assert.equal(f([[1, 9], [1, 1]]), 3);
  }
  for (let t = 0; t < 50; t++) {
    const g = makeCosts(1 + Math.floor(Math.random() * 30));
    const answers = all.map((f) => f(g));
    assert.ok(answers.every((a) => a === answers[0]), JSON.stringify(answers));
  }
});
