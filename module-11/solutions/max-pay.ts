// Exercise 1: pays[i] is what shift i pays, and every pay is positive. You can't work two shifts
// in a row. Returns the most you can earn. There can be up to 100,000 shifts.
// State: best(i) = the most from shifts 0..i. Skip shift i, or work it and skip shift i - 1:
// best(i) = max(best(i - 1), best(i - 2) + pays[i]). Bottom up with the last two values, so no
// recursion: O(n) time, O(1) memory.
export function maxPay(pays: number[]): number {
  let before = 0; // best(i - 2)
  let last = 0; // best(i - 1)
  for (const pay of pays) [before, last] = [last, Math.max(last, before + pay)];
  return last;
}
