// Research only: where does Kahn's extra growth come from? Same graphs, three key types:
// fresh strings (as makePackages builds them), shared string objects (every dependency is the same string
// object as the package's own name), numbers, numbers in plain arrays, and dependencies on near
// neighbours instead of random packages. node kahn-growth2.ts
import { bench } from "./bench.ts";
import { buildOrderKahn } from "./opening-fast.ts";

// The same shape as makePackages, with the key type as a choice.
function make<K>(n: number, key: (i: number) => K): Map<K, K[]> {
  const pkgs = new Map<K, K[]>();
  for (let i = n - 1; i >= 0; i--) {
    const deps = new Set<K>();
    if (i > 0) deps.add(key(i - 1));
    for (let k = 0; k < 2 && i > 1; k++) deps.add(key(Math.floor(Math.random() * (i - 1))));
    pkgs.set(key(i), [...deps]);
  }
  return pkgs;
}
const kahn = buildOrderKahn as unknown as <K>(p: Map<K, K[]>) => K[];

function shared(n: number): Map<string, string[]> {
  const names = Array.from({ length: n }, (_, i) => `pkg${i}`);
  return make(n, (i) => names[i]);
}

const sizes = [50_000, 100_000, 200_000, 400_000];
bench("fresh strings (makePackages)", sizes, (n) => make(n, (i) => `pkg${i}`), kahn);
bench("one string object per name", sizes, shared, kahn);
bench("number keys", sizes, (n) => make(n, (i) => i), kahn);

// Numbers in arrays only, no Map: deps[i] lists the dependencies of package i.
function kahnArrays(deps: number[][]): number[] {
  const n = deps.length;
  const waiting = new Int32Array(n);
  const dependents: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    waiting[i] = deps[i].length;
    for (const d of deps[i]) dependents[d].push(i);
  }
  const order: number[] = [];
  for (let i = 0; i < n; i++) if (waiting[i] === 0) order.push(i);
  for (let head = 0; head < order.length; head++) for (const next of dependents[order[head]]) if (--waiting[next] === 0) order.push(next);
  return order;
}
bench("arrays only, no Map", sizes, (n) => [...make(n, (i) => i).entries()].sort((a, b) => a[0] - b[0]).map(([, d]) => d), kahnArrays);

// The same chain with neighbours instead of random older packages: package i depends on i - 1, i - 2 and i - 3.
function makeLocal(n: number): Map<string, string[]> {
  const pkgs = new Map<string, string[]>();
  for (let i = n - 1; i >= 0; i--) pkgs.set(`pkg${i}`, [1, 2, 3].filter((k) => i - k >= 0).map((k) => `pkg${i - k}`));
  return pkgs;
}
bench("fresh strings, near dependencies only", sizes, makeLocal, kahn);
