import { test } from "node:test";
import assert from "node:assert/strict";
import { IndexQueue } from "./index-queue.ts";
import { Deque } from "./deque.ts";

test("IndexQueue keeps first-in, first-out order through compaction", () => {
  const q = new IndexQueue<number>();
  const ref: number[] = [];
  for (let i = 0; i < 50_000; i++) {
    if (Math.random() < 0.55) {
      q.push(i);
      ref.push(i);
    } else assert.equal(q.shift(), ref.shift());
    assert.equal(q.size, ref.length);
  }
  while (ref.length > 0) assert.equal(q.shift(), ref.shift());
  assert.equal(q.shift(), undefined);
});

test("empty Deque", () => {
  const d = new Deque<number>();
  assert.equal(d.shift(), undefined);
  assert.equal(d.pop(), undefined);
  assert.equal(d.peekFront(), undefined);
  assert.equal(d.peekBack(), undefined);
  assert.equal(d.size, 0);
});

test("Deque keeps order across wrap-around and growth", () => {
  const d = new Deque<number>(4); // small, so it wraps and grows often
  const ref: number[] = [];
  for (let i = 0; i < 20_000; i++) {
    const r = Math.random();
    if (r < 0.6) {
      d.push(i);
      ref.push(i);
    } else if (r < 0.8) assert.equal(d.shift(), ref.shift());
    else assert.equal(d.pop(), ref.pop());
    assert.equal(d.size, ref.length);
    assert.equal(d.peekFront(), ref[0]);
    assert.equal(d.peekBack(), ref.at(-1));
  }
});

test("Deque capacity must be a power of two", () => {
  assert.throws(() => new Deque(6), RangeError);
});
