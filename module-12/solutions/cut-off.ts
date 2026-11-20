// Practice 2: services lists every service once, target among them. Each call [from, to] means
// `from` calls `to`; calls can form loops. Returns the services that can't reach target through
// any chain of calls, in the order of `services`. Up to 100,000 services and 300,000 calls.
// Pattern: one graph walk with a visited set (Module 7), on the calls turned around. A service
// reaches target exactly when target reaches it backward, so one walk from target answers for all.
// O(V + E) time and memory.
export function cutOff(services: string[], calls: [string, string][], target: string): string[] {
  const callers = new Map<string, string[]>(); // to -> every from that calls it
  for (const [from, to] of calls) callers.getOrInsertComputed(to, () => []).push(from);
  const reaches = new Set<string>([target]);
  const stack = [target];
  while (stack.length > 0) {
    for (const from of callers.get(stack.pop()!) ?? []) {
      if (!reaches.has(from)) {
        reaches.add(from); // mark when pushed, so no service is pushed twice
        stack.push(from);
      }
    }
  }
  return services.filter((s) => !reaches.has(s));
}
