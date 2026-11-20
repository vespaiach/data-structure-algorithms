// Exercise 4: each booking is [start, end, value] for one room, half-open [start, end) with
// end > start, so a booking that ends at 10 and one that starts at 10 fit together. Returns the
// largest total value of bookings that don't overlap. You may import Module 9's bounds:
// import { lowerBound, upperBound } from "../../module-09/bounds.ts";
export type Booking = [start: number, end: number, value: number];

export function mostValue(bookings: Booking[]): number {
  throw new Error("not implemented");
}
