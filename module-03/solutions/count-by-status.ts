// How many orders are in each status? Return a Map from status to count.
// One pass, one Map lookup and one update per order: O(n) average time,
// O(k) extra memory, k = number of distinct statuses.
export type Order = { id: string; status: string };

export function countByStatus(orders: Order[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const { status } of orders) counts.set(status, (counts.get(status) ?? 0) + 1);
  return counts;
}
