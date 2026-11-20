import { test } from "node:test";
import assert from "node:assert/strict";
import { collectTags } from "./collect-tags.ts";

test("keeps order and duplicates", () => {
  const posts = [{ tags: ["node", "v8"] }, { tags: [] }, { tags: ["v8", "ts"] }];
  assert.deepEqual(collectTags(posts), ["node", "v8", "v8", "ts"]);
});

test("no posts", () => {
  assert.deepEqual(collectTags([]), []);
});

test("20,000 posts with 3 tags each take under 500 ms", () => {
  const posts = Array.from({ length: 20_000 }, (_, i) => ({ tags: [`a${i}`, `b${i}`, `c${i}`] }));
  const start = performance.now();
  const all = collectTags(posts);
  const ms = performance.now() - start;
  assert.equal(all.length, 60_000);
  assert.equal(all[59_999], "c19999");
  assert.ok(ms < 500, `took ${ms.toFixed(0)} ms`);
});
