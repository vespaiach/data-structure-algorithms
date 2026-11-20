// Practice 1: managerOf[i] is the manager of employee i, or -1 if i has no manager. Nobody manages
// themselves, directly or through others. Returns the most people in one chain of command, from
// someone with no manager down to one of their reports' reports, and so on (one person alone is a
// chain of 1). Up to 200,000 employees, and a manager's number can be larger than their report's.
// Pattern: a tree walk with an explicit stack (Module 6). Build each manager's list of reports
// once, then walk down from everyone with no manager, carrying the chain length.
// O(n) time: each employee is pushed and popped once. O(n) memory for the lists and the stack.
export function longestChain(managerOf: number[]): number {
  const reports: number[][] = Array.from({ length: managerOf.length }, () => []);
  const stack: [number, number][] = []; // [employee, people in the chain from the top to them]
  for (let e = 0; e < managerOf.length; e++) {
    if (managerOf[e] === -1) stack.push([e, 1]);
    else reports[managerOf[e]].push(e);
  }
  let most = 0;
  while (stack.length > 0) {
    const [e, length] = stack.pop()!;
    if (length > most) most = length;
    for (const r of reports[e]) stack.push([r, length + 1]);
  }
  return most;
}
