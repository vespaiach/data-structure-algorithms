// Research only: times of the exercise answers and the slow answers on the sizes of the timing tests,
// to choose sizes where the answer passes easily and the slow answer fails clearly: node calibrate.ts <name> <n>
// n is the number of files or jobs, the side of the map, or the length of each price list.
const [name, nText] = process.argv.slice(2);
const n = Number(nText);
const fast = await import(`./solutions/${name}.ts`);
const slow = await import(`./slow/${name}.ts`);
const inputs: Record<string, () => unknown[]> = {
  "merge-cost": () => [Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 1_000))],
  "job-order": () => [Array.from({ length: n }, (_, i) => ({ id: `j${i}`, arrive: Math.floor(Math.random() * 10), length: 1 + Math.floor(Math.random() * 1_000) }))],
  "cheapest-path": () => [Array.from({ length: n }, () => Array.from({ length: n }, () => String(1 + Math.floor(Math.random() * 9))).join(""))],
  "cheapest-trips": () => {
    const sorted = () => Array.from({ length: n }, () => 50 + Math.floor(Math.random() * 950)).sort((a, b) => a - b);
    return [sorted(), sorted(), 100];
  },
};
for (const [label, mod] of [["solution", fast], ["slow", slow]] as const) {
  const fn = Object.values(mod)[0] as (...a: unknown[]) => unknown;
  const args = inputs[name]();
  const start = performance.now();
  fn(...args);
  console.log(`${name} n=${n} ${label}: ${(performance.now() - start).toFixed(1)} ms`);
}
