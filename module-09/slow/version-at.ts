// A correct but slow answer to Exercise 2: scan from the newest release back. O(n) per call.
export type Release = { at: number; version: string };

export function versionAt(releases: Release[], t: number): string | undefined {
  return releases.findLast((r) => r.at <= t)?.version;
}
