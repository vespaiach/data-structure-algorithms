// Exercise 4: for each day, how many days in a row, ending that day, had an error count
// at most that day's count. The day itself counts, so every answer is at least 1.
// Monotonic stack of earlier days whose counts are larger than every later day so far:
// O(n) time (each day is pushed once and popped at most once), O(n) memory.
export function daysAtMost(counts: number[]): number[] {
  const result: number[] = [];
  const stack: number[] = []; // indexes; their counts decrease from bottom to top
  for (let i = 0; i < counts.length; i++) {
    while (stack.length > 0 && counts[stack[stack.length - 1]] <= counts[i]) stack.pop();
    // The top is now the previous larger day, or there is none.
    result.push(stack.length === 0 ? i + 1 : i - stack[stack.length - 1]);
    stack.push(i);
  }
  return result;
}
