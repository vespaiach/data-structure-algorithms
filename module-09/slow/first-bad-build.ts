// A correct but slow answer to Exercise 1: test the builds in order until one is bad.
// O(count) calls to isBad.
export function firstBadBuild(count: number, isBad: (build: number) => boolean): number {
  for (let build = 1; build <= count; build++) if (isBad(build)) return build;
  return count + 1;
}
