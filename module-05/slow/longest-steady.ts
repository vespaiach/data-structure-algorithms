// A correct O(n^2) answer to Exercise 5 that grows a window from every start, to show that the timing test catches it.
export function longestSteady(samples: number[], limit: number): number {
  let best = 0;
  for (let i = 0; i < samples.length; i++) {
    let max = samples[i];
    let min = samples[i];
    for (let j = i; j < samples.length; j++) {
      max = Math.max(max, samples[j]);
      min = Math.min(min, samples[j]);
      if (max - min > limit) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}
