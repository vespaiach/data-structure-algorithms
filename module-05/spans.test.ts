import { test } from "node:test";
import assert from "node:assert/strict";
import { spanDurations, type SpanEvent } from "./spans.ts";

const ev = (kind: "start" | "end", name: string, t: number): SpanEvent => ({ kind, name, t });

test("nested spans", () => {
  const log = [ev("start", "a", 0), ev("start", "b", 1), ev("end", "b", 4), ev("end", "a", 10)];
  assert.deepEqual(spanDurations(log), ["b 3 ms", "a 10 ms"]);
});
test("an end that does not match the latest start throws", () => {
  assert.throws(() => spanDurations([ev("start", "a", 0), ev("start", "b", 1), ev("end", "a", 2)]));
  assert.throws(() => spanDurations([ev("end", "a", 0)]));
});
test("a span that never ends throws", () => {
  assert.throws(() => spanDurations([ev("start", "a", 0)]), /a never ended/);
});
test("100,000 spans nested inside each other", () => {
  const log: SpanEvent[] = [];
  for (let i = 0; i < 100_000; i++) log.push(ev("start", `s${i}`, i));
  for (let i = 99_999; i >= 0; i--) log.push(ev("end", `s${i}`, 200_000 - i));
  const out = spanDurations(log);
  assert.equal(out.length, 100_000);
  assert.equal(out[0], "s99999 2 ms");
});
