// Group orders by customer: a Map from customer to that customer's orders, in list order.
// Target: O(n) time.
export type Order = { id: string; customer: string };

export function groupByCustomer(orders: Order[]): Map<string, Order[]> {
  throw new Error("not implemented");
}
