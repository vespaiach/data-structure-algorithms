import { test } from "node:test";
import assert from "node:assert/strict";
import { roomsNeeded } from "./rooms-needed.ts";

test("small days", () => {
  assert.equal(roomsNeeded([]), 0);
  assert.equal(roomsNeeded([[9, 10]]), 1);
  assert.equal(roomsNeeded([[9, 12], [10, 11], [11, 13], [12, 14]]), 2);
  assert.equal(roomsNeeded([[9, 10], [10, 11], [11, 12]]), 1); // touching meetings share a room
  assert.equal(roomsNeeded([[1, 5], [1, 5], [1, 5]]), 3);
});

// The most meetings going on at one moment; checking each start is enough.
function deepest(ms: [number, number][]): number {
  return Math.max(0, ...ms.map(([t]) => ms.filter(([s, e]) => s <= t && t < e).length));
}

test("matches the deepest overlap on random days", () => {
  for (let t = 0; t < 300; t++) {
    const ms = Array.from({ length: Math.floor(Math.random() * 30) }, (): [number, number] => {
      const s = Math.floor(Math.random() * 50);
      return [s, s + 1 + Math.floor(Math.random() * 10)];
    });
    assert.equal(roomsNeeded(ms), deepest(ms), JSON.stringify(ms));
  }
});

test("100,000 meetings in under 200 ms", () => {
  const meetings = Array.from({ length: 100_000 }, (): [number, number] => {
    const s = Math.floor(Math.random() * 100_000);
    return [s, s + 1 + Math.floor(Math.random() * 4_000)];
  });
  const start = performance.now();
  const rooms = roomsNeeded(meetings);
  const ms = performance.now() - start;
  assert.ok(rooms > 0);
  assert.ok(ms < 200, `took ${Math.round(ms)} ms`);
});
