// How many steps of each kind this machine does in a second, best of 5 runs: node ops-per-second.ts
// Every step feeds a result the program prints, so the compiler can't remove it.
let sink = 0;

function rate(label: string, steps: number, fn: (steps: number) => number): void {
  let best = Infinity;
  for (let run = 0; run < 5; run++) {
    const start = performance.now();
    sink += fn(steps);
    best = Math.min(best, performance.now() - start);
  }
  console.log(`${label.padEnd(36)}${best.toFixed(1).padStart(8)} ms  ${(steps / (best / 1000)).toExponential(1)} steps/s`);
}

const N = 100_000_000;
const arr = Array.from({ length: 1_000_000 }, (_, i) => i);
const big = new Map(arr.map((i) => [i, i]));
const small = new Map(arr.slice(0, 1_000).map((i) => [i, i]));

rate("add to a sum", N, (n) => {
  let s = 0;
  for (let i = 0; i < n; i++) s += i;
  return s;
});
rate("read an array of 1,000,000", N, (n) => {
  let s = 0;
  for (let i = 0; i < n; i++) s += arr[i % 1_000_000];
  return s;
});
rate("Map.get, 1,000 keys", N / 10, (n) => {
  let s = 0;
  for (let i = 0; i < n; i++) s += small.get(i % 1_000)!;
  return s;
});
rate("Map.get, 1,000,000 keys", N / 10, (n) => {
  let s = 0;
  for (let i = 0; i < n; i++) s += big.get(i % 1_000_000)!;
  return s;
});
rate("Set.add, growing to 1,000,000 keys", N / 100, (n) => {
  const set = new Set<number>();
  for (let i = 0; i < n; i++) set.add(i);
  return set.size;
});
rate("make a small object and keep it", N / 100, (n) => {
  const kept: { x: number }[] = [];
  for (let i = 0; i < n; i++) kept.push({ x: i });
  return kept.length;
});
console.log(sink > 0 ? "" : sink);
