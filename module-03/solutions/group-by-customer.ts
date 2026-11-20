// Group orders by customer: a Map from customer to that customer's orders, in list order.
// One Map lookup and one push per order: O(n) average time, O(n) extra memory.
// Map.groupBy(orders, (o) => o.customer) does the same (ES2024; runs on Node.js 22 and later).
export type Order = { id: string; customer: string };

export function groupByCustomer(orders: Order[]): Map<string, Order[]> {
  const groups = new Map<string, Order[]>();
  for (const order of orders) {
    let group = groups.get(order.customer);
    if (!group) {
      group = [];
      groups.set(order.customer, group);
    }
    group.push(order);
  }
  return groups;
}
