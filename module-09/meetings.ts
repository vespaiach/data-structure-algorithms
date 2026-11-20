// The most meetings one room can hold, with a greedy choice: node meetings.ts
import { bench } from "./bench.ts";

// A meeting is half-open [start, end): one that ends at 10 and one that starts at 10 fit together.
export type Meeting = [start: number, end: number];

// Try every subset and keep the largest one with no overlaps. O(2^n * n log n): only for small n.
export function mostMeetingsBrute(ms: Meeting[]): number {
  let best = 0;
  for (let mask = 0; mask < 1 << ms.length; mask++) {
    const chosen = ms.filter((_, i) => mask & (1 << i)).sort((a, b) => a[0] - b[0]);
    if (chosen.every((m, i) => i === 0 || chosen[i - 1][1] <= m[0])) best = Math.max(best, chosen.length);
  }
  return best;
}

// Greedy: sort by end, take each meeting that starts once the room is free.
// O(n log n) time for the sort, O(n) memory for the sorted copy and the result.
export function mostMeetings(ms: Meeting[]): Meeting[] {
  const taken: Meeting[] = [];
  let free = -Infinity; // when the room is free again
  for (const m of ms.toSorted((a, b) => a[1] - b[1])) {
    if (m[0] >= free) {
      taken.push(m);
      free = m[1];
    }
  }
  return taken;
}

// n meetings in a day of 10,000 minutes, each 1 to 60 minutes long.
export function makeDay(n: number): Meeting[] {
  return Array.from({ length: n }, (): Meeting => {
    const start = Math.floor(Math.random() * 10_000);
    return [start, start + 1 + Math.floor(Math.random() * 60)];
  });
}

if (process.argv[1] === import.meta.filename) {
  const day: Meeting[] = [[9, 17], [9, 11], [10, 12], [11, 13], [13, 15], [12, 16]];
  console.log("mostMeetings:", JSON.stringify(mostMeetings(day)), " brute force:", mostMeetingsBrute(day));
  bench("mostMeetingsBrute", [12, 14, 16], makeDay, mostMeetingsBrute);
  bench("mostMeetings", [250_000, 500_000, 1_000_000], makeDay, mostMeetings);
}
