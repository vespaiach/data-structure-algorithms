import { test } from "node:test";
import assert from "node:assert/strict";
import { type Setting, testMatrix } from "./test-matrix.ts";

const key = (xs: string[][]) => xs.map((c) => c.join(" ")).sort().join("\n");

// Every configuration, then drop the ones with a forbidden pair: correct but slow.
function bruteForce(settings: Setting[], forbidden: [string, string][]): string[][] {
  let all: string[][] = [[]];
  for (const s of settings) all = all.flatMap((c) => s.values.map((v) => [...c, `${s.name}=${v}`]));
  return all.filter((c) => !forbidden.some(([a, b]) => c.includes(a) && c.includes(b)));
}

const settings: Setting[] = [
  { name: "os", values: ["linux", "mac"] },
  { name: "browser", values: ["firefox", "safari", "chrome"] },
];

test("two settings and one forbidden pair", () => {
  assert.equal(key(testMatrix(settings, [["os=linux", "browser=safari"]])), key([
    ["os=linux", "browser=firefox"], ["os=linux", "browser=chrome"],
    ["os=mac", "browser=firefox"], ["os=mac", "browser=safari"], ["os=mac", "browser=chrome"],
  ]));
});

test("a pair is forbidden in either order, and values stay in the order of the settings", () => {
  const out = testMatrix(settings, [["browser=safari", "os=linux"]]);
  assert.equal(out.length, 5);
  assert.ok(out.every((c) => c[0].startsWith("os=") && c[1].startsWith("browser=")));
});

test("no settings: one empty configuration; a setting with no values: none", () => {
  assert.deepEqual(testMatrix([], []), [[]]);
  assert.deepEqual(testMatrix([...settings, { name: "db", values: [] }], []), []);
});

test("every configuration forbidden: none", () => {
  const forbidden: [string, string][] = [["os=linux", "browser=firefox"], ["os=linux", "browser=safari"],
    ["os=linux", "browser=chrome"], ["os=mac", "browser=firefox"], ["os=mac", "browser=safari"], ["os=mac", "browser=chrome"]];
  assert.deepEqual(testMatrix(settings, forbidden), []);
});

test("matches a brute force on 200 random cases", () => {
  for (let t = 0; t < 200; t++) {
    const ss: Setting[] = Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
      name: `s${i}`,
      values: Array.from({ length: Math.floor(Math.random() * 4) }, (_, j) => `v${j}`),
    }));
    // Forbidden pairs join values of two different settings.
    const forbidden: [string, string][] = [];
    for (let r = Math.floor(Math.random() * 5); r > 0 && ss.length > 1; r--) {
      const a = Math.floor(Math.random() * ss.length), b = Math.floor(Math.random() * ss.length);
      const any = (vs: string[]) => vs[Math.floor(Math.random() * vs.length)];
      const va = any(ss[a].values), vb = any(ss[b].values);
      if (a !== b && va !== undefined && vb !== undefined) forbidden.push([`${ss[a].name}=${va}`, `${ss[b].name}=${vb}`]);
    }
    assert.equal(key(testMatrix(ss, forbidden)), key(bruteForce(ss, forbidden)), JSON.stringify({ ss, forbidden }));
  }
});

test("10 settings of 4 values with many rules, in under 100 ms", () => {
  // Values may only go up from one setting to the next: 286 of the 4^10 configurations are allowed.
  const big: Setting[] = Array.from({ length: 10 }, (_, i) => ({ name: `s${i}`, values: ["0", "1", "2", "3"] }));
  const forbidden: [string, string][] = [];
  for (let i = 0; i + 1 < 10; i++)
    for (let a = 0; a < 4; a++) for (let b = 0; b < a; b++) forbidden.push([`s${i}=${a}`, `s${i + 1}=${b}`]);
  const start = performance.now();
  const out = testMatrix(big, forbidden);
  const ms = performance.now() - start;
  assert.equal(out.length, 286);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
