// A singly linked list node and two helpers used by the module's code and tests.
export type ListNode<T> = { value: T; next: ListNode<T> | null };

export function fromArray<T>(values: T[]): ListNode<T> | null {
  let head: ListNode<T> | null = null;
  for (let i = values.length - 1; i >= 0; i--) head = { value: values[i], next: head };
  return head;
}

export function toArray<T>(head: ListNode<T> | null): T[] {
  const out: T[] = [];
  for (let node = head; node !== null; node = node.next) out.push(node.value);
  return out;
}
