// Collect every tag of every post into one list, in order.
// concat() copied the whole list on every post: O(posts x total tags).
// push() appends in amortized O(1): O(total tags) time, O(total tags) memory for the result.
export function collectTags(posts: { tags: string[] }[]): string[] {
  const all: string[] = [];
  for (const post of posts) {
    for (const tag of post.tags) all.push(tag);
  }
  return all;
}
