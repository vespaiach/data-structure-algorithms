import { test } from "node:test";
import assert from "node:assert/strict";
import { type Release, versionAt } from "./version-at.ts";

const releases: Release[] = [
  { at: 100, version: "1.0" },
  { at: 250, version: "1.1" },
  { at: 250, version: "1.2" },
  { at: 400, version: "2.0" },
];

test("between releases, at a release, after the last", () => {
  assert.equal(versionAt(releases, 120), "1.0");
  assert.equal(versionAt(releases, 100), "1.0");
  assert.equal(versionAt(releases, 399), "1.2");
  assert.equal(versionAt(releases, 5000), "2.0");
});

test("two releases at the same time: the later one wins", () => {
  assert.equal(versionAt(releases, 250), "1.2");
});

test("before the first release, and no releases", () => {
  assert.equal(versionAt(releases, 99), undefined);
  assert.equal(versionAt([], 100), undefined);
});

test("matches a scan on random release lists", () => {
  for (let trial = 0; trial < 200; trial++) {
    let at = 0;
    const list = Array.from({ length: Math.floor(Math.random() * 30) }, (_, i): Release => ({ at: (at += Math.floor(Math.random() * 4)), version: `v${i}` }));
    const t = Math.floor(Math.random() * (at + 6)) - 2;
    assert.equal(versionAt(list, t), list.findLast((r) => r.at <= t)?.version, JSON.stringify({ list, t }));
  }
});

test("20,000 lookups in 20,000 releases in under 100 ms", () => {
  let at = 0;
  const list = Array.from({ length: 20_000 }, (_, i): Release => ({ at: (at += 1 + Math.floor(Math.random() * 60)), version: `v${i}` }));
  const times = Array.from({ length: 20_000 }, () => Math.floor(Math.random() * at));
  const start = performance.now();
  let found = 0;
  for (const t of times) if (versionAt(list, t) !== undefined) found++;
  const ms = performance.now() - start;
  assert.ok(found > 0);
  assert.ok(ms < 100, `took ${Math.round(ms)} ms`);
});
