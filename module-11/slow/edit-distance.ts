// Exercise 3, slow answer: the recursion without a memo. Correct, but every call makes three more
// calls, and the same (i, j) is solved again and again: exponential in the lengths.
export function editDistance(a: string, b: string): number {
  function d(i: number, j: number): number {
    if (i === 0) return j;
    if (j === 0) return i;
    return Math.min(d(i - 1, j) + 1, d(i, j - 1) + 1, d(i - 1, j - 1) + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d(a.length, b.length);
}
