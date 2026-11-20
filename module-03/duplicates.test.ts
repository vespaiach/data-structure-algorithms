import { test } from "node:test";
import assert from "node:assert/strict";
import { firstDuplicateSlow, firstDuplicate, hasDuplicateBySorting, type Order } from "./duplicates.ts";

const order = (id: string): Order => ({ id, customer: "c1", amount: 10 });

test("finds the first repeated ID", () => {
  const orders = ["a7", "b2", "c9", "b2", "a7"].map(order);
  assert.equal(firstDuplicateSlow(orders), "b2");
  assert.equal(firstDuplicate(orders), "b2");
  assert.equal(hasDuplicateBySorting(orders), true);
});

test("no repeats, and an empty list", () => {
  for (const orders of [["a", "b", "c"].map(order), []]) {
    assert.equal(firstDuplicateSlow(orders), undefined);
    assert.equal(firstDuplicate(orders), undefined);
    assert.equal(hasDuplicateBySorting(orders), false);
  }
});
