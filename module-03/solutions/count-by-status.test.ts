import { test } from "node:test";
import assert from "node:assert/strict";
import { countByStatus } from "./count-by-status.ts";

test("counts each status, in order of first appearance", () => {
  const orders = [
    { id: "1", status: "paid" },
    { id: "2", status: "refunded" },
    { id: "3", status: "paid" },
    { id: "4", status: "shipped" },
    { id: "5", status: "paid" },
  ];
  assert.deepEqual([...countByStatus(orders)], [["paid", 3], ["refunded", 1], ["shipped", 1]]);
});

test("a status named like an Object.prototype property", () => {
  const orders = [{ id: "1", status: "constructor" }, { id: "2", status: "constructor" }];
  assert.deepEqual([...countByStatus(orders)], [["constructor", 2]]);
});

test("no orders", () => {
  assert.equal(countByStatus([]).size, 0);
});
