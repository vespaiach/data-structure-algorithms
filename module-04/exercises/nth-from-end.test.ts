import { test } from "node:test";
import assert from "node:assert/strict";
import { fromArray } from "../list.ts";
import { nthFromEnd } from "./nth-from-end.ts";

const log = () => fromArray(["boot", "login", "upload", "logout", "shutdown"]);

test("k = 1 is the newest entry", () => {
  assert.equal(nthFromEnd(log(), 1)!.value, "shutdown");
});
test("k in the middle and k = length", () => {
  assert.equal(nthFromEnd(log(), 3)!.value, "upload");
  assert.equal(nthFromEnd(log(), 5)!.value, "boot");
});
test("fewer than k entries", () => {
  assert.equal(nthFromEnd(log(), 6), null);
  assert.equal(nthFromEnd(null, 1), null);
});
test("returns the node itself, not a copy", () => {
  const head = log()!;
  assert.equal(nthFromEnd(head, 5), head);
});
