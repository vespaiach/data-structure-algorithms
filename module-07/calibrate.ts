// Research only: times the solutions and the slow answers on the inputs of the timing tests,
// to choose test sizes and limits. node calibrate.ts
import * as fast from "./solutions/same-group.ts";
import * as slowSame from "./slow/same-group.ts";
import * as fastRoute from "./solutions/route.ts";
import * as slowRoute from "./slow/route.ts";
import * as fastStages from "./solutions/build-stages.ts";
import * as slowStages from "./slow/build-stages.ts";

const time = (fn: () => unknown) => {
  const start = performance.now();
  fn();
  return Math.round(performance.now() - start);
};

for (const questions of [300, 1_000]) {
  const half = 100_000;
  const links: [number, number][] = [];
  for (let i = 1; i < half; i++) links.push([i - 1, i], [half + i - 1, half + i]);
  const pairs: [number, number][] = Array.from({ length: questions }, () => [Math.floor(Math.random() * 2 * half), Math.floor(Math.random() * 2 * half)]);
  console.log(`sameGroup, ${questions} questions: solution ${time(() => fast.sameGroup(2 * half, links, pairs))} ms, slow ${time(() => slowSame.sameGroup(2 * half, links, pairs))} ms`);
}
for (const side of [500, 700]) {
  const big = Array.from({ length: side }, () => ".".repeat(side));
  const goal: [number, number] = [side - 1, side - 1];
  console.log(`route, ${side} x ${side}: solution ${time(() => fastRoute.route(big, [0, 0], goal))} ms, slow ${time(() => slowRoute.route(big, [0, 0], goal))} ms`);
}
for (const n of [10_000, 20_000]) {
  const pkgs = new Map<string, string[]>();
  for (let i = n - 1; i >= 0; i--) pkgs.set(`p${i}`, i === 0 ? [] : [`p${i - 1}`]);
  console.log(`buildStages, chain of ${n}: solution ${time(() => fastStages.buildStages(pkgs))} ms, slow ${time(() => slowStages.buildStages(pkgs))} ms`);
}
