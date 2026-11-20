import { test } from "node:test";
import assert from "node:assert/strict";
import { SizedCache } from "./sized-cache.ts";

test("evicts least recently used entries until the total fits", () => {
  const c = new SizedCache<string, string>(10);
  c.put("/a", "A", 4);
  c.put("/b", "B", 4);
  c.put("/c", "C", 2); // total 10, nothing evicted
  assert.deepEqual(c.keys(), ["/c", "/b", "/a"]);
  c.put("/d", "D", 7); // total 17: evicts /a, then /b
  assert.deepEqual(c.keys(), ["/d", "/c"]);
  assert.equal(c.totalSize, 9);
  assert.equal(c.get("/a"), undefined);
});
test("get makes a key the most recently used", () => {
  const c = new SizedCache<string, number>(3);
  c.put("a", 1, 1);
  c.put("b", 2, 1);
  c.put("c", 3, 1);
  assert.equal(c.get("a"), 1);
  c.put("d", 4, 1); // evicts b, not a
  assert.deepEqual(c.keys(), ["d", "a", "c"]);
});
test("put on an existing key replaces its value and size", () => {
  const c = new SizedCache<string, number>(10);
  c.put("a", 1, 3);
  c.put("b", 2, 3);
  c.put("a", 10, 6);
  assert.deepEqual(c.keys(), ["a", "b"]);
  assert.equal(c.totalSize, 9);
  assert.equal(c.get("a"), 10);
});
test("an entry larger than maxSize is not stored, and removes the old one", () => {
  const c = new SizedCache<string, number>(5);
  c.put("a", 1, 2);
  c.put("b", 2, 2);
  c.put("a", 3, 6);
  assert.deepEqual(c.keys(), ["b"]);
  assert.equal(c.totalSize, 2);
  assert.equal(c.get("a"), undefined);
});
test("matches a slow reference on random operations", () => {
  const c = new SizedCache<number, number>(20);
  let ref: { key: number; value: number; size: number }[] = []; // most recent first
  let seed = 3;
  const rand = (m: number) => Math.floor((seed = (seed * 1103515245 + 12345) % 2147483648) / 65536) % m; // high bits
  for (let i = 0; i < 3000; i++) {
    const key = rand(15);
    if (i % 3 === 0) {
      const hit = ref.find((e) => e.key === key);
      assert.equal(c.get(key), hit?.value);
      if (hit) ref = [hit, ...ref.filter((e) => e !== hit)];
    } else {
      const size = 1 + rand(8);
      c.put(key, i, size);
      ref = ref.filter((e) => e.key !== key);
      if (size <= 20) ref.unshift({ key, value: i, size });
      while (ref.reduce((s, e) => s + e.size, 0) > 20) ref.pop();
    }
    assert.deepEqual(c.keys(), ref.map((e) => e.key));
    assert.equal(c.totalSize, ref.reduce((s, e) => s + e.size, 0));
  }
});
test("200,000 puts into a cache of 50,000 entries take under 300 ms", () => {
  const c = new SizedCache<number, number>(50_000);
  const start = performance.now();
  for (let i = 0; i < 200_000; i++) c.put(i, i, 1);
  const ms = performance.now() - start;
  assert.equal(c.totalSize, 50_000);
  assert.ok(ms < 300, `took ${Math.round(ms)} ms`);
});
