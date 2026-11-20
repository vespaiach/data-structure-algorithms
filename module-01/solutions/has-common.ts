// Do two lists of emails share at least one address?
// O(a + b) time: one pass to fill the Set, one pass of O(1) lookups. O(a) extra memory.
export function hasCommon(a: string[], b: string[]): boolean {
  const seen = new Set(a);
  return b.some((email) => seen.has(email));
}
