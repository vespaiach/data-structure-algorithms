// Three more shapes of two pointers and windows. Run: node variations.ts

// Read and write pointers: remove every 0 in place and keep the order of the rest.
// `read` visits every item; `write` marks the end of the kept part.
// O(n) time, O(1) extra memory.
export function removeZeros(values: number[]): number[] {
  let write = 0;
  for (let read = 0; read < values.length; read++) {
    if (values[read] !== 0) {
      values[write] = values[read];
      write++;
    }
  }
  values.length = write;
  return values;
}

// A window of fixed size k: the average of every k consecutive response times.
// One item enters and one leaves per step. O(n) time, O(1) extra memory besides the result.
export function movingAverages(ms: number[], k: number): number[] {
  const averages: number[] = [];
  let total = 0;
  for (let i = 0; i < ms.length; i++) {
    total += ms[i]; // the new item enters
    if (i >= k) total -= ms[i - k]; // the oldest item leaves
    if (i >= k - 1) averages.push(total / k);
  }
  return averages;
}

// A window that grows and shrinks: the longest run of requests with at most `limit` failures.
// `right` adds a request; while there are too many failures, `left` drops one.
// O(n) time, O(1) extra memory.
export function longestWithFewFailures(failed: boolean[], limit: number): number {
  let left = 0;
  let failures = 0;
  let best = 0;
  for (let right = 0; right < failed.length; right++) {
    if (failed[right]) failures++;
    while (failures > limit) {
      if (failed[left]) failures--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

if (process.argv[1] === import.meta.filename) {
  console.log(removeZeros([4, 0, 7, 0, 0, 5]));
  console.log(movingAverages([120, 80, 100, 300, 50], 3));
  console.log(longestWithFewFailures([false, true, false, false, true, true, false], 1));
}
