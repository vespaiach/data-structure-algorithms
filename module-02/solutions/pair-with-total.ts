// Two prices in a sorted list that add up to `total`: return their indexes, or null.
// Two pointers from both ends: each step moves one pointer inward, so at most n steps.
// O(n) time, O(1) extra memory.
export function pairWithTotal(prices: number[], total: number): [number, number] | null {
  let left = 0;
  let right = prices.length - 1;
  while (left < right) {
    const sum = prices[left] + prices[right];
    if (sum === total) return [left, right];
    if (sum < total) left++;
    else right--;
  }
  return null;
}
