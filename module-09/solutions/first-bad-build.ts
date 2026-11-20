// Exercise 1: builds are numbered 1 to count. Once a build is bad, every later build is bad too.
// isBad(build) runs the tests on one build. Returns the first bad build, or count + 1 if every
// build is good, with as few calls to isBad as you can.
// Binary search on the build number over the half-open range [1, count + 1).
// O(log count) calls to isBad, O(1) memory.
export function firstBadBuild(count: number, isBad: (build: number) => boolean): number {
  let lo = 1, hi = count + 1; // every build before lo is good; hi is bad, or past the last build
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (isBad(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
