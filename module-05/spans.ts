// A trace log of nested spans: every "end" closes the span that started most recently.
export type SpanEvent = { kind: "start" | "end"; name: string; t: number };

// Each span's duration, in the order the spans end.
// A stack of open spans: O(n) time, O(d) memory for spans nested d deep.
export function spanDurations(events: SpanEvent[]): string[] {
  const open: SpanEvent[] = [];
  const out: string[] = [];
  for (const e of events) {
    if (e.kind === "start") {
      open.push(e);
      continue;
    }
    const start = open.pop(); // the most recent open span
    if (start === undefined || start.name !== e.name) throw new Error(`end ${e.name} does not match`);
    out.push(`${e.name} ${e.t - start.t} ms`);
  }
  if (open.length > 0) throw new Error(`${open.at(-1)!.name} never ended`);
  return out;
}

if (process.argv[1] === import.meta.filename) {
  const log: SpanEvent[] = [
    { kind: "start", name: "request", t: 0 },
    { kind: "start", name: "db", t: 2 },
    { kind: "end", name: "db", t: 9 },
    { kind: "start", name: "render", t: 10 },
    { kind: "end", name: "render", t: 14 },
    { kind: "end", name: "request", t: 15 },
  ];
  console.log(spanDurations(log));
}
