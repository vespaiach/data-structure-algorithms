// Exercise 2: `releases` is sorted by time, oldest first. Returns the version that was live at
// time t: the last release at or before t. Two releases at the same time: the later one in the
// list wins. Returns undefined before the first release.
export type Release = { at: number; version: string };

export function versionAt(releases: Release[], t: number): string | undefined {
  throw new Error("not implemented");
}
