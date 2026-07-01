import { describe, expect, it } from "vitest";

import { type ProblemDefinition } from "@/game/problem";
import { hashProblemDef } from "@/utils/hash";

const problem = (o: Partial<ProblemDefinition> = {}): ProblemDefinition => ({
  leftValue: 2,
  rightValue: 3,
  operator: "ADD",
  answer: 5,
  ...o,
});

describe("hashProblemDef", () => {
  it("is deterministic for the same problem", async () => {
    expect(await hashProblemDef(problem())).toBe(
      await hashProblemDef(problem()),
    );
  });

  it("produces different hashes for different problems", async () => {
    const a = await hashProblemDef(problem({ leftValue: 2 }));
    const b = await hashProblemDef(problem({ leftValue: 9, answer: 12 }));
    expect(a).not.toBe(b);
  });

  it("distinguishes operator even when operands match", async () => {
    const add = await hashProblemDef(problem({ operator: "ADD", answer: 6 }));
    const mul = await hashProblemDef(
      problem({ operator: "MULTIPLY", answer: 6 }),
    );
    expect(add).not.toBe(mul);
  });
});
