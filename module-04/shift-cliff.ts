// How the cost of one shift() changes with the array's length in V8.
// Below about 16,000 elements V8 moves the array's start (left-trim); above it, it copies.
function nsPerShift(n: number): number {
  const reps = Math.max(1, Math.floor(2_000_000 / n));
  let total = 0;
  for (let r = 0; r < reps + 1; r++) {
    const a: number[] = [];
    for (let i = 0; i < n; i++) a.push(i);
    const start = performance.now();
    while (a.length > 0) a.shift();
    if (r > 0) total += performance.now() - start; // run 0 is warm-up
  }
  return (total * 1e6) / (reps * n);
}

console.log("length".padStart(8) + "ns per shift".padStart(14));
for (const n of [50, 100, 200, 1_000, 4_000, 8_000, 16_000, 16_500, 17_000, 32_000, 64_000, 128_000]) {
  console.log(String(n).padStart(8) + nsPerShift(n).toFixed(1).padStart(14));
}
