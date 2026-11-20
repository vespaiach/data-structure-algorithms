// bench.ts: run a function on inputs of several sizes and print a table of times.
// For each size: one warm-up run, then `runs` timed runs on fresh inputs.
// Prints the median time and how many times slower it is than the previous size.

export function bench<T>(
  label: string,
  sizes: number[],
  makeInput: (n: number) => T,
  fn: (input: T) => unknown,
  runs = 5,
): void {
  console.log(`\n${label}`);
  console.log("n".padStart(14) + "median ms".padStart(12) + "x prev".padStart(9));
  let prev = 0;
  for (const n of sizes) {
    fn(makeInput(n)); // warm-up: lets the JIT compile fn before we time it
    const times: number[] = [];
    for (let r = 0; r < runs; r++) {
      const input = makeInput(n); // building the input is not timed
      const start = performance.now();
      fn(input);
      times.push(performance.now() - start);
    }
    times.sort((a, b) => a - b);
    const median = times[Math.floor(times.length / 2)];
    const ratio = prev ? (median / prev).toFixed(1) : "";
    console.log(n.toLocaleString("en-US").padStart(14) + median.toFixed(2).padStart(12) + ratio.padStart(9));
    prev = median;
  }
}
