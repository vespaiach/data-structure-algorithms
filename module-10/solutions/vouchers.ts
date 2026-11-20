// Exercise 3: values are positive voucher amounts, and two vouchers can have the same amount.
// Returns every set of vouchers (each voucher used at most once) whose amounts add up to exactly
// target, each set in ascending order and listed once.
// Sort, then prune with break: once an amount is too big, every later one is too. Skip an amount
// equal to the one before it at the same level, so a set never comes out twice.
// O(N * n) time for N nodes of the pruned tree (at most 2^n) and n vouchers; O(n) memory besides
// the output.
export function vouchersForTotal(values: number[], target: number): number[][] {
  const sorted = values.toSorted((a, b) => a - b);
  const out: number[][] = [];
  const path: number[] = [];
  function explore(start: number, left: number): void {
    if (left === 0) {
      out.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > left) break; // prune: sorted, so every later amount is too big too
      if (i > start && sorted[i] === sorted[i - 1]) continue; // the same choice as the last branch
      path.push(sorted[i]); // choose
      explore(i + 1, left - sorted[i]); // explore
      path.pop(); // undo
    }
  }
  explore(0, target);
  return out;
}
