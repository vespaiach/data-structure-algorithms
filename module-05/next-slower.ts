// For each request, the index of the next request that took longer, or -1.
// Monotonic stack: O(n) time, O(n) memory. Each index is pushed once and popped at most once.
export function nextSlower(ms: number[]): number[] {
  const result = new Array<number>(ms.length).fill(-1);
  const stack: number[] = []; // indexes still waiting; their times never increase from bottom to top
  for (let i = 0; i < ms.length; i++) {
    while (stack.length > 0 && ms[stack[stack.length - 1]] < ms[i]) {
      result[stack.pop()!] = i;
    }
    stack.push(i);
  }
  return result;
}
