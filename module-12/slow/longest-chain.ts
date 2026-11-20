// Practice 1: managerOf[i] is the manager of employee i, or -1 if i has no manager. Nobody manages
// themselves, directly or through others. Returns the most people in one chain of command, from
// someone with no manager down to one of their reports' reports, and so on (one person alone is a
// chain of 1). Up to 200,000 employees, and a manager's number can be larger than their report's.
// Slow: from every employee, walk up to the top and count. Correct, but O(n * h) time for a
// chain h people long, O(n^2) on one long chain. O(1) memory.
export function longestChain(managerOf: number[]): number {
  let most = 0;
  for (let e = 0; e < managerOf.length; e++) {
    let length = 1;
    for (let m = managerOf[e]; m !== -1; m = managerOf[m]) length++;
    if (length > most) most = length;
  }
  return most;
}
