// Has any order been submitted twice? Return the ID of the first order whose ID
// already appeared earlier in the list, or undefined.

export type Order = { id: string; customer: string; amount: number };

// Compare each order with every earlier order: O(n^2) time, O(1) extra memory.
export function firstDuplicateSlow(orders: Order[]): string | undefined {
  for (let i = 0; i < orders.length; i++) {
    for (let j = 0; j < i; j++) {
      if (orders[j].id === orders[i].id) return orders[i].id;
    }
  }
  return undefined;
}

// Remember every ID seen so far in a Set: O(n) average time, O(n) extra memory.
export function firstDuplicate(orders: Order[]): string | undefined {
  const seen = new Set<string>();
  for (const order of orders) {
    if (seen.has(order.id)) return order.id;
    seen.add(order.id);
  }
  return undefined;
}

// Sort a copy of the IDs, then equal IDs sit next to each other.
// O(n log n) time, O(n) extra memory for the copy. Answers "is there a duplicate?",
// but not "which order came first", because sorting loses the original order.
export function hasDuplicateBySorting(orders: Order[]): boolean {
  const ids = orders.map((o) => o.id).sort();
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === ids[i - 1]) return true;
  }
  return false;
}
