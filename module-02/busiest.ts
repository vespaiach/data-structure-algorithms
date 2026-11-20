// The busiest minute in a request log.
// `times` holds request times in seconds since midnight, sorted ascending.
// A minute is any 60-second window [start, start + 60). The busiest one can always
// start at a request time, so we only try those starts. Ties go to the earliest start.

export type Busiest = { start: number; count: number };

// For every request, re-scan the whole log: O(n^2) time, O(1) extra memory.
export function busiestSlow(times: number[]): Busiest {
  let best: Busiest = { start: 0, count: 0 };
  for (const start of times) {
    let count = 0;
    for (const t of times) {
      if (t >= start && t < start + 60) count++;
    }
    if (count > best.count) best = { start, count };
  }
  return best;
}

// Sliding window with two pointers: `right` only moves forward, so the inner loop
// runs at most n times in total. O(n) time, O(1) extra memory.
export function busiestWindow(times: number[]): Busiest {
  let best: Busiest = { start: 0, count: 0 };
  let right = 0;
  for (let left = 0; left < times.length; left++) {
    while (right < times.length && times[right] < times[left] + 60) right++;
    if (right - left > best.count) best = { start: times[left], count: right - left };
  }
  return best;
}

// Prefix sums over the seconds of the day: before[s] = requests before second s.
// Building costs O(n + S) time and O(S) memory, S = 86,400 seconds; then any range
// [from, to) costs O(1): before[to] - before[from].
export const SECONDS = 86_400;

export function prefixCounts(times: number[]): Int32Array {
  const before = new Int32Array(SECONDS + 1);
  for (const t of times) before[t + 1]++;
  for (let s = 1; s <= SECONDS; s++) before[s] += before[s - 1];
  return before;
}

export function busiestByPrefix(times: number[]): Busiest {
  const before = prefixCounts(times);
  let best: Busiest = { start: 0, count: 0 };
  for (const start of times) {
    const count = before[Math.min(start + 60, SECONDS)] - before[start];
    if (count > best.count) best = { start, count };
  }
  return best;
}
