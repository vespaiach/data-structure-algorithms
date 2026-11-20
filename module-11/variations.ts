// Two more shapes of dynamic programming: one number per amount, and a table over two lists.
// node variations.ts
import { bench } from "./bench.ts";

// Module 9's coin table. fewest[a] = the fewest coins that add up to exactly a.
// fewest[a] = 1 + the smallest fewest[a - c] over the coins c <= a. fewest[0] = 0.
// O(amount * k) time for k coins, O(amount) memory. Returns -1 when no mix of coins adds up to amount.
export function fewestCoins(coins: number[], amount: number): number {
  const fewest = new Array<number>(amount + 1).fill(Infinity);
  fewest[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a && fewest[a - c] + 1 < fewest[a]) fewest[a] = fewest[a - c] + 1;
  return fewest[amount] === Infinity ? -1 : fewest[amount];
}

// The longest common subsequence: the most items that appear in both lists in the same order,
// not necessarily next to each other. t[i][j] = the answer for a[0..i) and b[0..j).
// Equal last items: t[i - 1][j - 1] + 1. Otherwise the larger of t[i - 1][j] and t[i][j - 1].
// O(m * n) time and memory.
export function lcsTable(a: string, b: string): number[][] {
  const t = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      t[i][j] = a[i - 1] === b[j - 1] ? t[i - 1][j - 1] + 1 : Math.max(t[i - 1][j], t[i][j - 1]);
  return t;
}

// The same length with two rows: row i needs only row i - 1. O(m * n) time, O(n) memory.
export function lcsTwoRows(a: string, b: string): number {
  let above = new Array<number>(b.length + 1).fill(0);
  let row = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++)
      row[j] = a[i - 1] === b[j - 1] ? above[j - 1] + 1 : Math.max(above[j], row[j - 1]);
    [above, row] = [row, above]; // the row just filled is the next row's "above"
  }
  return above[b.length];
}

// Random strings of n letters from a four-letter alphabet.
export const randomText = (n: number): string =>
  Array.from({ length: n }, () => "acgt"[Math.floor(Math.random() * 4)]).join("");

let sink = 0;

if (process.argv[1] === import.meta.filename) {
  console.log("fewestCoins([1, 3, 4], 6):", fewestCoins([1, 3, 4], 6));
  console.log("fewestCoins([1, 5, 10, 25], 63):", fewestCoins([1, 5, 10, 25], 63));
  console.log("fewestCoins([4, 6], 7):", fewestCoins([4, 6], 7));
  console.log('lcs("deploy", "replay"):', lcsTable("deploy", "replay")[6][6], lcsTwoRows("deploy", "replay"));

  const pair = (n: number) => ({ a: randomText(n), b: randomText(n) });
  bench("lcsTable (full table)", [1_000, 2_000, 4_000], pair, ({ a, b }) => (sink += lcsTable(a, b)[a.length][b.length]));
  bench("lcsTwoRows", [1_000, 2_000, 4_000], pair, ({ a, b }) => (sink += lcsTwoRows(a, b)));
  if (sink === 0) console.log(sink);
}
