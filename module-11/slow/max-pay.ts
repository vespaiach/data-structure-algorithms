// Exercise 1, slow answer: the recursion without a memo. Correct, but O(phi^n): best(i - 1) and
// best(i - 2) both solve best(i - 3), and so on down.
export function maxPay(pays: number[]): number {
  function best(i: number): number {
    if (i < 0) return 0;
    return Math.max(best(i - 1), best(i - 2) + pays[i]);
  }
  return best(pays.length - 1);
}
