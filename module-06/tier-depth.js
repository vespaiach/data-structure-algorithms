// Research only: the deepest chain recursive maxDepth handles in each V8 tier.
// Run with --allow-natives-syntax and one tier's flags, for example:
//   node --allow-natives-syntax --no-sparkplug --no-maglev --no-turbofan tier-depth.js   (interpreter only)
// Status bits from V8 14.6 src/runtime/runtime.h (OptimizationStatus): 1<<3 optimized, 1<<4 Maglev,
// 1<<5 TurboFan, 1<<6 interpreted, 1<<14 baseline (Sparkplug).
function maxDepth(folder) {
  let deepest = 0;
  for (const child of folder.children) deepest = Math.max(deepest, maxDepth(child));
  return deepest + 1;
}
function deepChain(depth) {
  const root = { name: "f0", size: 1, children: [] };
  let cur = root;
  for (let i = 1; i < depth; i++) {
    const next = { name: `f${i}`, size: 1, children: [] };
    cur.children.push(next);
    cur = next;
  }
  return root;
}
function limit() {
  let ok = 1, bad = 100_000;
  while (bad - ok > 1) {
    const mid = (ok + bad) >> 1;
    try { maxDepth(deepChain(mid)); ok = mid; } catch { bad = mid; }
  }
  return ok;
}
function tier() {
  const s = %GetOptimizationStatus(maxDepth);
  const names = [];
  if (s & (1 << 6)) names.push("interpreted");
  if (s & (1 << 14)) names.push("baseline");
  if (s & (1 << 4)) names.push("maglev");
  if (s & (1 << 5)) names.push("turbofan");
  return names.join("+") || `status 0b${s.toString(2)}`;
}
const mode = process.argv[2] ?? "default";
if (mode === "maglev" || mode === "turbofan") {
  %PrepareFunctionForOptimization(maxDepth);
  maxDepth(deepChain(10));
  maxDepth(deepChain(10));
  if (mode === "maglev") %OptimizeMaglevOnNextCall(maxDepth);
  else %OptimizeFunctionOnNextCall(maxDepth);
  maxDepth(deepChain(10));
}
const before = tier();
const l = limit();
console.log(`${mode.padEnd(12)} tier before ${before.padEnd(22)} deepest chain ${String(l).padStart(6)}   tier after ${tier()}`);
