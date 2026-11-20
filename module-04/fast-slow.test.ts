import { test } from "node:test";
import assert from "node:assert/strict";
import { fromArray, type ListNode } from "./list.ts";
import { middleNode, hasCycle } from "./fast-slow.ts";

test("middle: odd length", () => {
  assert.equal(middleNode(fromArray(["p1", "p2", "p3", "p4", "p5"]))!.value, "p3");
});
test("middle: even length returns the second middle", () => {
  assert.equal(middleNode(fromArray([1, 2, 3, 4]))!.value, 3);
  assert.equal(middleNode(fromArray([1, 2]))!.value, 2);
});
test("middle: one node and empty", () => {
  assert.equal(middleNode(fromArray([7]))!.value, 7);
  assert.equal(middleNode(null), null);
});
test("hasCycle: every cycle position in lists up to 20 long", () => {
  assert.equal(hasCycle(null), false);
  for (let len = 1; len <= 20; len++) {
    for (let at = -1; at < len; at++) {
      const head = fromArray(Array.from({ length: len }, (_, i) => i));
      const nodes: ListNode<number>[] = [];
      for (let n = head; n !== null; n = n.next) nodes.push(n);
      if (at >= 0) nodes[len - 1].next = nodes[at];
      assert.equal(hasCycle(head), at >= 0, `len ${len}, cycle at ${at}`);
    }
  }
});
