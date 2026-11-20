// A correct missingIds that scans `received` for every expected ID: O(e * r) time.
// Run against the exercise's test: node --test slow/missing-ids.test.ts
export function missingIds(expected: string[], received: string[]): string[] {
  return expected.filter((id) => !received.includes(id));
}
