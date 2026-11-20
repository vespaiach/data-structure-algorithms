// Tests for the code in the reading: node --test "*.test.ts"
import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidOrder, makePackages, type Packages } from "./packages.ts";
import { buildOrderSlow } from "./opening-slow.ts";
import { buildOrderKahn } from "./opening-fast.ts";
import { buildOrderKahnIds } from "./kahn-ids.ts";
import { allDeps, ladder, pushesWithoutSet } from "./needs.ts";
import { fewestSteps, fewestStepsStrings, makeGrid } from "./grid.ts";
import { buildOrderDfs, countGroups } from "./variations.ts";

const rand = (n: number) => Math.floor(Math.random() * n);

// A random graph of n packages: each package gets up to 4 random dependencies.
// With `acyclic`, a package only depends on packages that come later in a random ranking.
function randomPackages(n: number, acyclic: boolean): Packages {
  const names = Array.from({ length: n }, (_, i) => `p${i}`).sort(() => Math.random() - 0.5);
  const pkgs: Packages = new Map();
  names.forEach((name, i) => {
    const deps = new Set<string>();
    for (let k = rand(5); k > 0; k--) {
      const j = acyclic ? i + 1 + rand(n - i - 1) : rand(n);
      if (j < n) deps.add(names[j]);
    }
    pkgs.set(name, [...deps]);
  });
  return pkgs;
}

// True when the packages contain a cycle, by repeatedly removing packages with no dependencies left.
function hasCycleByPeeling(pkgs: Packages): boolean {
  const left = new Map([...pkgs].map(([k, v]) => [k, new Set(v)]));
  for (let changed = true; changed; ) {
    changed = false;
    for (const [name, deps] of left) {
      if (deps.size === 0) {
        left.delete(name);
        for (const other of left.values()) other.delete(name);
        changed = true;
      }
    }
  }
  return left.size > 0;
}

test("the three build orders are valid on random graphs, and all throw on a cycle", () => {
  const sizes = new Set<number>(), edgeCounts = new Set<number>();
  let cycles = 0;
  for (let r = 0; r < 300; r++) {
    const n = 1 + rand(40);
    const pkgs = randomPackages(n, r % 2 === 0);
    sizes.add(n);
    edgeCounts.add([...pkgs.values()].reduce((s, d) => s + d.length, 0));
    if (hasCycleByPeeling(pkgs)) {
      cycles++;
      for (const fn of [buildOrderSlow, buildOrderKahn, buildOrderDfs]) assert.throws(() => fn(pkgs), /cycle/);
    } else {
      for (const fn of [buildOrderSlow, buildOrderKahn, buildOrderDfs, buildOrderKahnIds]) assert.ok(isValidOrder(pkgs, fn(pkgs)));
    }
  }
  assert.ok(sizes.size > 20 && edgeCounts.size > 30, "varied graphs");
  assert.ok(cycles > 50 && cycles < 250, `both kinds: ${cycles} with a cycle`);
  assert.deepEqual(buildOrderKahn(new Map()), []);
});

test("makePackages is a varied acyclic graph, and Kahn handles 200,000", () => {
  const pkgs = makePackages(2_000);
  // The random dependencies of package i should spread evenly over 0 to i - 2.
  let ratio = 0, picks = 0;
  for (const [name, deps] of pkgs) {
    const i = Number(name.slice(3));
    for (const d of deps.slice(1)) {
      ratio += Number(d.slice(3)) / (i - 1);
      picks++;
    }
  }
  assert.ok(picks > 3_900 && Math.abs(ratio / picks - 0.5) < 0.03, `random dependencies: ${picks}, mean ${ratio / picks}`);
  assert.equal(hasCycleByPeeling(pkgs), false);
  const big = makePackages(200_000);
  assert.ok(isValidOrder(big, buildOrderKahn(big)));
});

test("the build orders reject a dependency that is not in the list", () => {
  const pkgs: Packages = new Map([["app", ["lib"]], ["cli", []]]);
  assert.throws(() => buildOrderKahn(pkgs), /not in the list/);
  assert.throws(() => buildOrderDfs(pkgs), /not in the list/);
  assert.equal(isValidOrder(pkgs, ["cli", "app"]), false);
});

test("allDeps against a brute-force closure", () => {
  for (let r = 0; r < 200; r++) {
    const pkgs = randomPackages(1 + rand(30), r % 2 === 0);
    // Brute force: grow the set until nothing new is added.
    for (const name of pkgs.keys()) {
      const reach = new Set<string>(pkgs.get(name));
      for (let size = -1; size !== reach.size; ) {
        size = reach.size;
        for (const x of [...reach]) for (const d of pkgs.get(x)!) reach.add(d);
      }
      reach.delete(name);
      assert.deepEqual(new Set(allDeps(pkgs, name)), reach);
    }
  }
  assert.equal(pushesWithoutSet(ladder(10), "a0"), 2 ** 11 - 2);
  assert.equal(allDeps(ladder(10), "a0").length, 20);
});

test("both grid searches agree with a brute-force distance table", () => {
  for (let r = 0; r < 300; r++) {
    const rows = 1 + rand(7), cols = 1 + rand(7);
    const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() < 0.3 ? "#" : ".")).join(""));
    // Brute force: relax every cell from its neighbours until nothing changes.
    const INF = 1e9;
    const d = Array.from({ length: rows }, () => new Array(cols).fill(INF));
    if (grid[0][0] === ".") d[0][0] = 0;
    for (let changed = true; changed; ) {
      changed = false;
      for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++) {
          if (grid[i][j] === "#") continue;
          for (const [a, b] of [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]) {
            if (a >= 0 && b >= 0 && a < rows && b < cols && d[a][b] + 1 < d[i][j]) {
              d[i][j] = d[a][b] + 1;
              changed = true;
            }
          }
        }
    }
    const want = d[rows - 1][cols - 1] === INF ? -1 : d[rows - 1][cols - 1];
    assert.equal(fewestSteps(grid), want, grid.join("/"));
    assert.equal(fewestStepsStrings(grid), want);
  }
  const big = makeGrid(300);
  assert.equal(fewestSteps(big), 2 * 299); // the open top row and right column give the shortest way
  assert.equal(fewestStepsStrings(big), 2 * 299);
});

test("countGroups against union by relabelling", () => {
  for (let r = 0; r < 300; r++) {
    const n = rand(40);
    const links: [number, number][] = Array.from({ length: n === 0 ? 0 : rand(40) }, () => [rand(n), rand(n)]);
    const label = Array.from({ length: n }, (_, i) => i);
    for (const [a, b] of links) {
      const from = label[a], to = label[b];
      for (let i = 0; i < n; i++) if (label[i] === from) label[i] = to;
    }
    assert.equal(countGroups(n, links), new Set(label).size);
  }
  const chain: [number, number][] = Array.from({ length: 199_999 }, (_, i) => [i, i + 1]);
  assert.equal(countGroups(200_000, chain), 1);
});
