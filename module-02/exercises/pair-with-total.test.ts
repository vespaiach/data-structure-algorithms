import { test } from "node:test";
import assert from "node:assert/strict";
import { pairWithTotal } from "./pair-with-total.ts";

test("finds a pair", () => {
  const prices = [3, 8, 12, 15, 21, 30];
  const pair = pairWithTotal(prices, 27);
  assert.ok(pair);
  assert.equal(prices[pair[0]] + prices[pair[1]], 27);
  assert.ok(pair[0] < pair[1]);
});

test("does not use one price twice", () => {
  assert.equal(pairWithTotal([5, 9], 10), null);
  assert.deepEqual(pairWithTotal([5, 5], 10), [0, 1]);
});

test("no pair, empty list, one price", () => {
  assert.equal(pairWithTotal([1, 2, 4], 100), null);
  assert.equal(pairWithTotal([], 0), null);
  assert.equal(pairWithTotal([7], 7), null);
});

test("agrees with a brute-force check on random lists", () => {
  for (let round = 0; round < 200; round++) {
    const prices = Array.from({ length: 20 }, () => Math.floor(Math.random() * 50)).sort((a, b) => a - b);
    const total = Math.floor(Math.random() * 100);
    let exists = false;
    for (let i = 0; i < prices.length; i++)
      for (let j = i + 1; j < prices.length; j++) if (prices[i] + prices[j] === total) exists = true;
    const pair = pairWithTotal(prices, total);
    assert.equal(pair !== null, exists);
    if (pair) assert.equal(prices[pair[0]] + prices[pair[1]], total);
  }
});
