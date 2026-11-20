// Practice 2: services lists every service once, target among them. Each call [from, to] means
// `from` calls `to`; calls can form loops. Returns the services that can't reach target through
// any chain of calls, in the order of `services`. Up to 100,000 services and 300,000 calls.
// Slow: a walk forward from every service, each with its own visited set. Correct, but
// O(V * (V + E)) time: the walks repeat the same calls. O(V + E) memory.
export function cutOff(services: string[], calls: [string, string][], target: string): string[] {
  const callees = new Map<string, string[]>();
  for (const [from, to] of calls) callees.getOrInsertComputed(from, () => []).push(to);
  return services.filter((start) => {
    const seen = new Set<string>([start]);
    const stack = [start];
    while (stack.length > 0) {
      const s = stack.pop()!;
      if (s === target) return false; // it reaches target
      for (const to of callees.get(s) ?? []) {
        if (!seen.has(to)) {
          seen.add(to);
          stack.push(to);
        }
      }
    }
    return true;
  });
}
