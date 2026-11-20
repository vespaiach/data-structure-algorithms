// Research only: the cost of one value passed up through d levels of yield*: node yield-depth.ts
function* leaf(count: number): Generator<number> {
  for (let i = 0; i < count; i++) yield i;
}
function* chain(depth: number, count: number): Generator<number> {
  if (depth === 0) yield* leaf(count);
  else yield* chain(depth - 1, count);
}
const COUNT = 200_000;
for (let round = 0; round < 2; round++) {
  const row: string[] = [];
  for (const d of [0, 5, 10, 20, 40]) {
    const start = performance.now();
    let sum = 0;
    for (const x of chain(d, COUNT)) sum += x;
    const ns = ((performance.now() - start) * 1e6) / COUNT;
    if (sum !== (COUNT * (COUNT - 1)) / 2) throw new Error("wrong sum");
    row.push(`depth ${d}: ${ns.toFixed(0)} ns`);
  }
  console.log(`round ${round + 1}, ns per value  ` + row.join("   "));
}
