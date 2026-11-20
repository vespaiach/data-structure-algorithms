// Collect every tag of every post into one list, in order.
// This version is correct but slow. Find the hidden cost and make it O(total tags).
export function collectTags(posts: { tags: string[] }[]): string[] {
  let all: string[] = [];
  for (const post of posts) {
    all = all.concat(post.tags);
  }
  return all;
}
