// Prints Figures 1, 2, 4, 5, 6, 7, 8 and 9 of the module: node trace-demo.ts
// Each trace is the loop or recursion of the real function with a print added, and its
// result is checked against that function.
import assert from "node:assert/strict";
import { waysSlow } from "./opening-slow.ts";
import { waysMemo, waysTable, waysTwoVars } from "./opening-fast.ts";
import { countTeamsMemo, countTeamsTable, countTeamsRow } from "./teams-count.ts";
import { fewestCoins, lcsTable } from "./variations.ts";
import { type Candidate } from "../module-10/opening-slow.ts";

const pad = (x: unknown, w: number) => String(x).padStart(w);

console.log("Figure 1: the calls of waysSlow(5)\n");
{
  const seen = new Set<number>();
  let calls = 0;
  function ways(n: number, prefix: string, last: boolean, top: boolean): number {
    calls++;
    const again = n >= 2 && seen.has(n) ? "   (again)" : "";
    seen.add(n);
    console.log(top ? `ways(${n})` : `${prefix}${last ? "`-- " : "+-- "}ways(${n})${again}`);
    if (n <= 1) return 1;
    const inner = top ? "" : prefix + (last ? "    " : "|   ");
    return ways(n - 1, inner, false, false) + ways(n - 2, inner, true, false);
  }
  const result = ways(5, "", true, true);
  assert.equal(result, waysSlow(5));
  assert.equal(calls, 2 * result - 1);
  console.log(`\n${calls} calls for ${result} ways`);
}

console.log("\nFigure 2: the calls of waysMemo(5)\n");
{
  const memo = new Map<number, number>();
  let calls = 0;
  function ways(n: number, depth: number): number {
    calls++;
    const indent = "  ".repeat(depth);
    if (n <= 1) {
      console.log(`${indent}ways(${n}) = 1, base case`);
      return 1;
    }
    const known = memo.get(n);
    if (known !== undefined) {
      console.log(`${indent}ways(${n}) = ${known}, from the memo`);
      return known;
    }
    console.log(`${indent}ways(${n}): not in the memo, solve it`);
    const result = ways(n - 1, depth + 1) + ways(n - 2, depth + 1);
    memo.set(n, result);
    console.log(`${indent}store ways(${n}) = ${result}`);
    return result;
  }
  assert.equal(ways(5, 0), waysMemo(5));
  console.log(`\n${calls} calls`);
}

console.log("\nFigure 4: waysTable(6), and the two values waysTwoVars keeps\n");
{
  const n = 6;
  const table = new Array<number>(n + 1);
  table[0] = 1;
  table[1] = 1;
  for (let i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2];
  assert.equal(table[n], waysTable(n));
  console.log("index  " + table.map((_, i) => pad(i, 4)).join(""));
  console.log("ways   " + table.map((v) => pad(v, 4)).join(""));

  console.log("\ni   before  last");
  let before = 1, last = 1;
  console.log(`-   ${pad(before, 6)}  ${pad(last, 4)}   start: ways(0), ways(1)`);
  for (let i = 2; i <= n; i++) {
    [before, last] = [last, before + last];
    console.log(`${i}   ${pad(before, 6)}  ${pad(last, 4)}`);
  }
  assert.equal(last, waysTwoVars(n));
}

// Module 10's four candidates, with costs and budget in hundreds so that every left from 0 to 7 shows.
const cands: Candidate[] = [
  { name: "Ana", cost: 3 },
  { name: "Bo", cost: 2 },
  { name: "Cy", cost: 5 },
  { name: "Di", cost: 4 },
];
const budget = 7;

console.log("\nFigure 5: one level per candidate, each node labeled with its state (next, left)\n");
{
  const seen = new Set<string>();
  let leaves = 0;
  function walk(i: number, left: number, label: string, depth: number): void {
    const state = `(${i}, ${left})`;
    const again = seen.has(state) ? "   (again)" : "";
    seen.add(state);
    console.log(`${"  ".repeat(depth)}${label}${state}${again}`);
    if (i === cands.length) {
      leaves++;
      return;
    }
    if (cands[i].cost <= left) walk(i + 1, left - cands[i].cost, `take ${cands[i].name}: `, depth + 1);
    walk(i + 1, left, `skip ${cands[i].name}: `, depth + 1);
  }
  walk(0, budget, "", 0);
  assert.equal(leaves - 1, countTeamsMemo(cands, budget)); // every leaf is a team, the empty one included
  console.log(`\n${leaves} leaves: ${leaves - 1} teams and the empty team`);
}

const cols = [0, 1, 2, 3, 4, 5, 6, 7];

console.log("\nFigure 6: the table teams(i, left), filled from the last row up\n");
{
  const n = cands.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(budget + 1).fill(0));
  table[n].fill(1);
  for (let i = n - 1; i >= 0; i--)
    for (let left = 0; left <= budget; left++)
      table[i][left] = table[i + 1][left] + (cands[i].cost <= left ? table[i + 1][left - cands[i].cost] : 0);
  assert.equal(table[0][budget] - 1, countTeamsTable(cands, budget));
  console.log("i  next     left:" + cols.map((c) => pad(c, 4)).join(""));
  for (let i = n; i >= 0; i--) {
    const who = i === n ? "(none)" : `${cands[i].name} ${cands[i].cost}`;
    console.log(`${i}  ${who.padEnd(14)}` + cols.map((c) => pad(table[i][c], 4)).join(""));
  }
  console.log(`\nteams(0, 7) = ${table[0][budget]}, minus the empty team = ${table[0][budget] - 1}`);
}

console.log("\nFigure 7: countTeamsRow's pass for Bo (cost 2), from the largest left down\n");
{
  const row = new Array<number>(budget + 1).fill(1);
  let bo = -1;
  for (let i = cands.length - 1; i >= 0; i--) {
    if (cands[i].name === "Bo") {
      bo = i;
      console.log("row before: " + row.join(" "));
      for (let left = budget; left >= cands[i].cost; left--) {
        const from = left - cands[i].cost;
        const next = row[left] + row[from];
        console.log(`left ${left}: row[${left}] ${row[left]} + row[${from}] ${row[from]} (not updated yet) = ${next}`);
        row[left] = next;
      }
      console.log("row after:  " + row.join(" "));
    } else for (let left = budget; left >= cands[i].cost; left--) row[left] += row[left - cands[i].cost];
  }
  assert.ok(bo >= 0);
  assert.equal(row[budget] - 1, countTeamsRow(cands, budget));
}

console.log("\nFigure 8: fewestCoins([1, 3, 4], 6), one amount at a time\n");
{
  const coins = [1, 3, 4];
  const amount = 6;
  const fewest = new Array<number>(amount + 1).fill(Infinity);
  const usedCoin = new Array<number>(amount + 1).fill(0);
  fewest[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a && fewest[a - c] + 1 < fewest[a]) {
        fewest[a] = fewest[a - c] + 1;
        usedCoin[a] = c;
      }
  assert.equal(fewest[amount], fewestCoins(coins, amount));
  console.log("amount       " + fewest.map((_, a) => pad(a, 4)).join(""));
  console.log("fewest       " + fewest.map((v) => pad(v, 4)).join(""));
  console.log("last coin    " + usedCoin.map((c, a) => pad(a === 0 ? "-" : c, 4)).join(""));
  const parts: number[] = [];
  for (let a = amount; a > 0; a -= usedCoin[a]) parts.push(usedCoin[a]);
  console.log(`\n6 = ${parts.join(" + ")}`);
}

console.log('\nFigure 9: the LCS table of "deploy" and "replay"\n');
{
  const a = "deploy", b = "replay";
  const t = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      t[i][j] = a[i - 1] === b[j - 1] ? t[i - 1][j - 1] + 1 : Math.max(t[i - 1][j], t[i][j - 1]);
  assert.deepEqual(t, lcsTable(a, b));
  console.log("      " + [" ", ...b].map((ch) => pad(ch, 3)).join(""));
  t.forEach((row, i) => console.log(pad(i === 0 ? " " : a[i - 1], 3) + "   " + row.map((v) => pad(v, 3)).join("")));
  console.log(`\nlength ${t[a.length][b.length]}`);
}
