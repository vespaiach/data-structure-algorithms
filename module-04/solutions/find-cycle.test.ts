import { test } from "node:test";
import assert from "node:assert/strict";
import { fromArray, type ListNode } from "../list.ts";
import { findCycleStart } from "./find-cycle.ts";

// Builds a chain from `urls` whose last node points back to urls[cycleAt] (no cycle if cycleAt is -1).
function chain(urls: string[], cycleAt: number): { head: ListNode<string> | null; nodes: ListNode<string>[] } {
  const head = fromArray(urls);
  const nodes: ListNode<string>[] = [];
  for (let n = head; n !== null; n = n.next) nodes.push(n);
  if (cycleAt >= 0) nodes[nodes.length - 1].next = nodes[cycleAt];
  return { head, nodes };
}

test("a chain that ends", () => {
  assert.equal(findCycleStart(chain(["/a", "/b", "/c"], -1).head), null);
  assert.equal(findCycleStart(null), null);
});
test("a cycle back to the middle", () => {
  const { head, nodes } = chain(["/old", "/new", "/login", "/home", "/promo"], 2);
  assert.equal(findCycleStart(head), nodes[2]);
});
test("a cycle back to the head", () => {
  const { head, nodes } = chain(["/a", "/b", "/c", "/d"], 0);
  assert.equal(findCycleStart(head), nodes[0]);
});
test("a page that redirects to itself", () => {
  const { head, nodes } = chain(["/a", "/b"], 1);
  assert.equal(findCycleStart(head), nodes[1]);
});
test("every cycle position in chains up to 30 long", () => {
  for (let len = 1; len <= 30; len++) {
    for (let at = -1; at < len; at++) {
      const { head, nodes } = chain(Array.from({ length: len }, (_, i) => `/${i}`), at);
      assert.equal(findCycleStart(head), at === -1 ? null : nodes[at], `len ${len}, cycle at ${at}`);
    }
  }
});
