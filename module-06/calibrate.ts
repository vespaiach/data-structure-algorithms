// Research only: times the slow and fast answers to Exercises 2 and 5, to set the test limits. node calibrate.ts
import { wideTree } from "./folders.ts";
import { build, shuffled } from "./bst.ts";
import { namesByLevel as slowLevels } from "./slow/names-by-level.ts";
import { namesByLevel as fastLevels } from "./solutions/names-by-level.ts";
import { keysInRange as slowRange } from "./slow/keys-in-range.ts";
import { keysInRange as fastRange } from "./solutions/keys-in-range.ts";
for (const n of [100_000, 200_000]) for (const [l, fn] of [["slow", slowLevels], ["fast", fastLevels]] as const) {
  const t = wideTree(n); const s = performance.now(); fn(t); console.log("levels", n, l, Math.round(performance.now() - s));
}
const root = build(shuffled(100_000));
for (const [l, fn] of [["slow", slowRange], ["fast", fastRange]] as const) {
  const s = performance.now(); let c = 0;
  for (let q = 0; q < 2_000; q++) { const low = Math.floor(Math.random() * 99_990); c += fn(root, low, low + 9).length; }
  console.log("range 2000 queries", l, Math.round(performance.now() - s), c);
}
