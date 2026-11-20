// Research only: is the first mostMeetingsBrute row in meetings.ts cold? node warm-up.ts
// Times twelve runs at 12 meetings in a fresh process, each on a new random day.
import { makeDay, mostMeetingsBrute } from "./meetings.ts";

const ms: string[] = [];
for (let run = 0; run < 12; run++) {
  const day = makeDay(12);
  const start = performance.now();
  mostMeetingsBrute(day);
  ms.push((performance.now() - start).toFixed(2));
}
console.log("ms per run:", ms.join(" "));
