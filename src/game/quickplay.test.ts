import { describe, expect, it } from "vitest";

import {
  buildQuickPlaySet,
  difficultyByProblem,
  problemKey,
  QUICKPLAY_SIZE,
  roundDifficulty,
  type QuickPlayRound,
} from "@/game/quickplay";
import { generateProblems, type ProblemDefinition } from "@/game/problem";

const round = (
  problem: { leftValue: number; rightValue: number; operator: string },
  overrides: Partial<QuickPlayRound> = {},
): QuickPlayRound => ({
  problem,
  isCompleted: true,
  durationMs: 500,
  attemptCount: 1,
  ...overrides,
});

// Deterministic identity shuffle so selection is assertable in tests.
const noShuffle = <T>(items: T[]): T[] => [...items];

describe("roundDifficulty", () => {
  it("is zero for a clean, quick, single-attempt solve", () => {
    expect(
      roundDifficulty(round({ leftValue: 8, rightValue: 7, operator: "MULTIPLY" })),
    ).toBe(0);
  });

  it("weights missed problems the heaviest", () => {
    const missed = roundDifficulty(
      round(
        { leftValue: 8, rightValue: 7, operator: "MULTIPLY" },
        { isCompleted: false },
      ),
    );
    const slow = roundDifficulty(
      round(
        { leftValue: 8, rightValue: 7, operator: "MULTIPLY" },
        { durationMs: 9000 },
      ),
    );
    expect(missed).toBeGreaterThan(slow);
  });

  it("adds weight for each extra attempt", () => {
    expect(
      roundDifficulty(
        round(
          { leftValue: 8, rightValue: 7, operator: "MULTIPLY" },
          { attemptCount: 3 },
        ),
      ),
    ).toBeGreaterThan(0);
  });
});

describe("difficultyByProblem", () => {
  it("aggregates weight across rounds for the same problem", () => {
    const weights = difficultyByProblem([
      round({ leftValue: 8, rightValue: 7, operator: "MULTIPLY" }, { isCompleted: false }),
      round({ leftValue: 8, rightValue: 7, operator: "MULTIPLY" }, { attemptCount: 2 }),
      round({ leftValue: 2, rightValue: 2, operator: "ADD" }),
    ]);

    expect(weights.get(problemKey({ leftValue: 8, rightValue: 7, operator: "MULTIPLY" }))).toBeGreaterThan(0);
    // A clean solve contributes nothing.
    expect(weights.get(problemKey({ leftValue: 2, rightValue: 2, operator: "ADD" }))).toBe(0);
  });
});

describe("buildQuickPlaySet", () => {
  const pool: ProblemDefinition[] = generateProblems(
    [2, 3, 4, 5, 6, 7, 8, 9],
    ["ADD", "SUBTRACT", "MULTIPLY"],
  );

  it("returns a bounded, de-duplicated set", () => {
    const set = buildQuickPlaySet({ pool, weights: new Map() });
    expect(set.length).toBe(QUICKPLAY_SIZE);
    expect(new Set(set.map(problemKey)).size).toBe(set.length);
  });

  it("prioritises weak problems when history exists", () => {
    const weakProblem = { leftValue: 8, rightValue: 7, operator: "MULTIPLY" };
    const weights = new Map([[problemKey(weakProblem), 20]]);

    const set = buildQuickPlaySet({
      pool,
      weights,
      shuffle: noShuffle,
    });

    expect(set.some((p) => problemKey(p) === problemKey(weakProblem))).toBe(true);
  });

  it("never exceeds the pool size for a small pool", () => {
    const small: ProblemDefinition[] = generateProblems([2], ["ADD"]);
    const set = buildQuickPlaySet({ pool: small, weights: new Map() });
    expect(set.length).toBe(small.length);
    expect(set.length).toBeLessThan(QUICKPLAY_SIZE);
  });
});
