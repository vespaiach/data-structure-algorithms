// Exercise 5: how many rooms does a day of meetings need? Meetings are half-open
// [start, end), so a meeting that ends at 10 and one that starts at 10 can share a room.
// You may import the Heap from "../../module-08/heap.ts".
// Sort by start. A min-heap holds the end time of each room in use, and its top is the room
// that is free first. O(n log n) time, O(n) memory.
import { Heap } from "../../module-08/heap.ts";

export function roomsNeeded(meetings: [number, number][]): number {
  const ends = new Heap<number>((a, b) => a < b);
  for (const [start, end] of meetings.toSorted((a, b) => a[0] - b[0])) {
    if (ends.size > 0 && ends.peek()! <= start) ends.replaceTop(end); // reuse the room free first
    else ends.push(end); // every room is busy: open a new one
  }
  return ends.size;
}
