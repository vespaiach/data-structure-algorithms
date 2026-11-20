// Exercise 2, slow answer: every order of the steps, then keep the ones that follow every rule.
// Correct, but O(n! * n * r): it builds all n! orders whatever the rules.
import { orderings } from "../shapes.ts";

export function deployOrders(steps: string[], rules: [string, string][]): string[][] {
  return orderings(steps).filter((o) => rules.every(([a, b]) => o.indexOf(a) < o.indexOf(b)));
}
