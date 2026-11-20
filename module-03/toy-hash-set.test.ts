import { test } from "node:test";
import assert from "node:assert/strict";
import { ToyHashSet } from "./toy-hash-set.ts";

test("matches a Set over random adds and deletes, in insertion order", () => {
  const toy = new ToyHashSet();
  const real = new Set<string>();
  for (let i = 0; i < 5_000; i++) {
    const key = `k${Math.floor(Math.random() * 300)}`;
    if (Math.random() < 0.3) assert.equal(toy.delete(key), real.delete(key));
    else {
      toy.add(key);
      real.add(key);
    }
    assert.equal(toy.has(key), real.has(key));
  }
  assert.equal(toy.size, real.size);
  assert.deepEqual([...toy], [...real]);
});
