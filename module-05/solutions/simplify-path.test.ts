import { test } from "node:test";
import assert from "node:assert/strict";
import { simplifyPath } from "./simplify-path.ts";

test("dots and double dots", () => {
  assert.equal(simplifyPath("/var/log/../www/./html"), "/var/www/html");
  assert.equal(simplifyPath("/a/./b/../../c/"), "/c");
});
test("empty parts and a trailing slash", () => {
  assert.equal(simplifyPath("/home//user/"), "/home/user");
  assert.equal(simplifyPath("/"), "/");
});
test("going above the root stays at the root", () => {
  assert.equal(simplifyPath("/../"), "/");
  assert.equal(simplifyPath("/a/b/../../../../c"), "/c");
});
test("names that only look like dots", () => {
  assert.equal(simplifyPath("/.../a/..b/.c"), "/.../a/..b/.c");
});
test("a path of 200,000 parts", () => {
  const path = "/x".repeat(100_000) + "/..".repeat(99_999);
  assert.equal(simplifyPath(path), "/x");
});
