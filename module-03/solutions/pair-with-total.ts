// Two payments in an unsorted list that add up to `total`: return their indexes, or null.
// For each amount, ask a Map whether its partner (total - amount) came earlier.
// O(n) average time, O(n) extra memory. Sorting plus two pointers would be
// O(n log n) time and would need the original indexes carried along.
export function pairWithTotal(amounts: number[], total: number): [number, number] | null {
  const indexOf = new Map<number, number>();
  for (let i = 0; i < amounts.length; i++) {
    const partner = indexOf.get(total - amounts[i]);
    if (partner !== undefined) return [partner, i];
    indexOf.set(amounts[i], i);
  }
  return null;
}
