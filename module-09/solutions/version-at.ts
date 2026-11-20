// Exercise 2: `releases` is sorted by time, oldest first. Returns the version that was live at
// time t: the last release at or before t. Two releases at the same time: the later one in the
// list wins. Returns undefined before the first release.
export type Release = { at: number; version: string };

// The upper bound of t on the release times, minus one.
// O(log n) time, O(1) memory.
export function versionAt(releases: Release[], t: number): string | undefined {
  let lo = 0, hi = releases.length; // before lo: at <= t; from hi on: at > t
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (releases[mid].at <= t) lo = mid + 1;
    else hi = mid;
  }
  return lo > 0 ? releases[lo - 1].version : undefined;
}
