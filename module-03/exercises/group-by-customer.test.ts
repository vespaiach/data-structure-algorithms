import { test } from "node:test";
import assert from "node:assert/strict";
import { groupByCustomer } from "./group-by-customer.ts";

test("groups orders and keeps their order", () => {
  const orders = [
    { id: "o1", customer: "ana" },
    { id: "o2", customer: "ben" },
    { id: "o3", customer: "ana" },
  ];
  const groups = groupByCustomer(orders);
  assert.deepEqual([...groups.keys()], ["ana", "ben"]);
  assert.deepEqual(groups.get("ana")?.map((o) => o.id), ["o1", "o3"]);
  assert.deepEqual(groups.get("ben")?.map((o) => o.id), ["o2"]);
});

test("matches Map.groupBy", () => {
  const orders = Array.from({ length: 1000 }, (_, i) => ({ id: `o${i}`, customer: `c${i % 37}` }));
  assert.deepEqual(groupByCustomer(orders), Map.groupBy(orders, (o) => o.customer));
});

test("no orders", () => {
  assert.equal(groupByCustomer([]).size, 0);
});
