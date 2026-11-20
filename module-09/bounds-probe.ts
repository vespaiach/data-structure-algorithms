// Research only: lowerBound with 21 runs per size, to see past the noise of 5 runs. node bounds-probe.ts
import { bench } from "./bench.ts";
import { makeLookups, withLowerBound } from "./bounds.ts";

bench("lowerBound, 1,000 lookups, 21 runs", [100_000, 200_000, 400_000, 800_000, 1_600_000, 3_200_000], makeLookups, withLowerBound, 21);
