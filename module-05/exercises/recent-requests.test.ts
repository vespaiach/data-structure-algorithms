import { test } from "node:test";
import assert from "node:assert/strict";
import { RecentRequests } from "./recent-requests.ts";

test("counts requests in the last 3000 ms", () => {
  const r = new RecentRequests(3000);
  assert.equal(r.hit(1), 1);
  assert.equal(r.hit(100), 2);
  assert.equal(r.hit(3001), 2); // 1 is now exactly 3000 ms old: out
  assert.equal(r.hit(3002), 3); // 100 is still in (100 > 2)
  assert.equal(r.hit(3100), 3); // 100 is out: 3001, 3002, 3100
});
test("several requests at the same time", () => {
  const r = new RecentRequests(10);
  assert.equal(r.hit(5), 1);
  assert.equal(r.hit(5), 2);
  assert.equal(r.hit(15), 1);
});
test("300,000 requests in a window of 50,000 ms take under 500 ms", () => {
  const r = new RecentRequests(50_000);
  let last = 0;
  const start = performance.now();
  for (let t = 0; t < 300_000; t++) last = r.hit(t);
  const ms = performance.now() - start;
  assert.equal(last, 50_000);
  assert.ok(ms < 500, `took ${Math.round(ms)} ms`);
});
