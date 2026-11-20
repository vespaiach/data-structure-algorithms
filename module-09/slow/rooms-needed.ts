// A correct but slow answer to Exercise 5: sort by start, then scan every room for one that is
// free. O(n * rooms).
export function roomsNeeded(meetings: [number, number][]): number {
  const ends: number[] = []; // when each room is free again
  for (const [start, end] of meetings.toSorted((a, b) => a[0] - b[0])) {
    const room = ends.findIndex((e) => e <= start);
    if (room === -1) ends.push(end);
    else ends[room] = end;
  }
  return ends.length;
}
