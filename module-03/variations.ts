// Three more shapes of hashing: counting, grouping, and remembering earlier totals.
// Run: node variations.ts

// Counting: how many requests got each status code.
// One get and one set per item: O(n) average time, O(k) extra memory, k = distinct codes.
export function countCodes(codes: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const code of codes) counts.set(code, (counts.get(code) ?? 0) + 1);
  return counts;
}

// Grouping: the paths each user requested, in log order.
// getOrInsertComputed returns the user's array, creating it on first use.
// O(n) average time, O(n) extra memory.
export type Request = { user: string; path: string };

export function pathsByUser(requests: Request[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const { user, path } of requests) groups.getOrInsertComputed(user, () => []).push(path);
  return groups;
}

// Remembering earlier totals: the longest run of days after which the stock is back
// where it started (the changes in the run add up to 0). Changes can be negative.
// `firstAt` maps a running total to the first point where it appeared; the same total
// seen again means the days in between add up to 0. O(n) average time, O(n) memory.
export function longestNetZero(changes: number[]): { start: number; length: number } {
  const firstAt = new Map<number, number>([[0, 0]]); // a total of 0 before day 0
  let total = 0;
  let best = { start: 0, length: 0 };
  for (let day = 0; day < changes.length; day++) {
    total += changes[day];
    const start = firstAt.get(total);
    if (start === undefined) firstAt.set(total, day + 1);
    else if (day + 1 - start > best.length) best = { start, length: day + 1 - start };
  }
  return best;
}

if (process.argv[1] === import.meta.filename) {
  console.log(countCodes([200, 404, 200, 500, 200, 404]));
  const requests: Request[] = [
    { user: "ana", path: "/cart" },
    { user: "ben", path: "/" },
    { user: "ana", path: "/pay" },
  ];
  console.log(pathsByUser(requests));
  console.log(Map.groupBy(requests, (r) => r.user));
  console.log(longestNetZero([2, -1, 3, -2, -2, 1, 4]));
}
