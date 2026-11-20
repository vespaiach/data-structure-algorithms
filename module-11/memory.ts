// How much memory a full table holds, against two rows: node --expose-gc memory.ts
// Each size runs in a fresh process: in one loop, the last size's table can still be alive
// when the next "before" is read, and the numbers come out too small.
import { execFileSync } from "node:child_process";
import { lcsTable, lcsTwoRows, randomText } from "./variations.ts";

const gc = (globalThis as { gc?: () => void }).gc;
if (!gc) throw new Error("run with node --expose-gc memory.ts");

if (process.argv[2] === "one") {
  const n = Number(process.argv[3]);
  const a = randomText(n), b = randomText(n);
  gc();
  const before = process.memoryUsage().heapUsed;
  const table = lcsTable(a, b);
  gc();
  const after = process.memoryUsage().heapUsed;
  const cells = (n + 1) * (n + 1);
  console.log(
    `n = ${n.toLocaleString("en-US")}: the full table holds ${((after - before) / 1024 / 1024).toFixed(1)} MB, ` +
      `${((after - before) / cells).toFixed(2)} bytes per cell; two rows hold ${2 * (n + 1)} numbers ` +
      `(same answer: ${table[n][n] === lcsTwoRows(a, b)})`,
  );
} else {
  for (const n of [1_000, 2_000, 4_000])
    process.stdout.write(execFileSync(process.execPath, ["--expose-gc", import.meta.filename, "one", String(n)]));
}
