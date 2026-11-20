import { test } from "node:test";
import assert from "node:assert/strict";
import { LruCache } from "./lru-cache.ts";

test("evicts the least recently used key", () => {
  const c = new LruCache<string, number>(2);
  c.put("/home", 1);
  c.put("/about", 2);
  c.put("/blog", 3); // evicts /home
  assert.equal(c.get("/home"), undefined);
  assert.equal(c.get("/about"), 2);
  assert.equal(c.size, 2);
});
test("get makes a key the most recently used", () => {
  const c = new LruCache<string, number>(2);
  c.put("a", 1);
  c.put("b", 2);
  c.get("a");
  c.put("c", 3); // evicts b, not a
  assert.deepEqual(c.keys(), ["c", "a"]);
});
test("put on an existing key updates it and does not evict", () => {
  const c = new LruCache<string, number>(2);
  c.put("a", 1);
  c.put("b", 2);
  c.put("a", 10);
  assert.equal(c.size, 2);
  assert.deepEqual(c.keys(), ["a", "b"]);
  assert.equal(c.get("a"), 10);
});
test("capacity 1", () => {
  const c = new LruCache<number, string>(1);
  c.put(1, "x");
  c.put(2, "y");
  assert.deepEqual(c.keys(), [2]);
  assert.equal(c.get(1), undefined);
});
test("matches a slow reference on random operations", () => {
  const c = new LruCache<number, number>(5);
  let ref: number[] = []; // keys, most recent first
  const vals = new Map<number, number>();
  let seed = 1;
  const rand = () => Math.floor((seed = (seed * 1103515245 + 12345) % 2147483648) / 65536) % 12; // high bits: the low bits repeat quickly
  for (let i = 0; i < 2000; i++) {
    const k = rand();
    if (i % 3 === 0) {
      const got = c.get(k);
      assert.equal(got, ref.includes(k) ? vals.get(k) : undefined);
      if (ref.includes(k)) ref = [k, ...ref.filter((x) => x !== k)];
    } else {
      c.put(k, i);
      vals.set(k, i);
      ref = [k, ...ref.filter((x) => x !== k)].slice(0, 5);
    }
    assert.deepEqual(c.keys(), ref);
  }
});
