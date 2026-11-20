// When do the counts stop fitting in a Number exactly? node precision.ts
import { waysTwoVars } from "./opening-fast.ts";

// waysTwoVars with BigInt: exact for any n, because a BigInt never rounds. O(n) additions,
// each on numbers with O(n) bits.
export function waysBig(n: number): bigint {
  let before = 1n;
  let last = 1n;
  for (let i = 2; i <= n; i++) [before, last] = [last, before + last];
  return last;
}

if (process.argv[1] === import.meta.filename) {
  const MAX = BigInt(Number.MAX_SAFE_INTEGER);
  console.log("Number.MAX_SAFE_INTEGER =", Number.MAX_SAFE_INTEGER, "= 2^53 - 1:", Number.MAX_SAFE_INTEGER === 2 ** 53 - 1);

  let firstOver = -1;
  let firstWrong = -1;
  for (let n = 0; n <= 100; n++) {
    const exact = waysBig(n);
    if (firstOver < 0 && exact > MAX) firstOver = n;
    if (firstWrong < 0 && BigInt(waysTwoVars(n)) !== exact) firstWrong = n;
  }
  for (const n of [firstOver - 1, firstOver]) console.log(`ways(${n}) = ${waysBig(n)}  safe: ${waysBig(n) <= MAX}`);
  console.log(`first n over MAX_SAFE_INTEGER: ${firstOver}; first n where the Number answer is wrong: ${firstWrong}`);
  console.log(`ways(${firstWrong}): Number ${waysTwoVars(firstWrong)}, exact ${waysBig(firstWrong)}`);
  console.log(`ways(100): Number ${waysTwoVars(100)}, exact ${waysBig(100)}`);
  console.log("Number.isSafeInteger(waysTwoVars(78)):", Number.isSafeInteger(waysTwoVars(78)));

  let inf = 0;
  while (Number.isFinite(waysTwoVars(inf))) inf++;
  console.log(`waysTwoVars(${inf - 1}) = ${waysTwoVars(inf - 1)}; waysTwoVars(${inf}) = ${waysTwoVars(inf)}`);

  try {
    // @ts-ignore: a BigInt plus a Number, on purpose, to show the error
    console.log(waysBig(10) + 1);
  } catch (err) {
    console.log("waysBig(10) + 1 ->", `${(err as Error).name}: ${(err as Error).message}`);
  }
  console.log("waysBig(10) + 1n ->", waysBig(10) + 1n);
}
