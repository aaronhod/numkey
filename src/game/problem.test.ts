import { describe, expect, it } from "vitest";

import {
  generateProblems,
  getOperatorChar,
  OPERATORS,
  shuffleProblemListNumbers,
  shuffleProblemListOrder,
  type ProblemDefinition,
  toString,
} from "@/game/problem";

describe("getOperatorChar", () => {
  it("maps each operator to its symbol", () => {
    expect(getOperatorChar("ADD")).toBe("+");
    expect(getOperatorChar("SUBTRACT")).toBe("-");
    expect(getOperatorChar("MULTIPLY")).toBe("×");
    expect(getOperatorChar("DIVIDE")).toBe("÷");
  });
});

describe("generateProblems", () => {
  it("creates a problem for each left value 2..12 for one operator/number", () => {
    const problems = generateProblems([2], ["ADD"]);
    expect(problems).toHaveLength(11); // left values 2..12 inclusive
    expect(problems[0]).toEqual({
      leftValue: 2,
      rightValue: 2,
      operator: "ADD",
      answer: 4,
    });
    expect(problems.at(-1)).toEqual({
      leftValue: 12,
      rightValue: 2,
      operator: "ADD",
      answer: 14,
    });
  });

  it("computes correct answers for every operator", () => {
    // The first generated problem always has leftValue 2.
    expect(generateProblems([5], ["ADD"])[0]).toMatchObject({ answer: 7 });
    expect(generateProblems([5], ["SUBTRACT"])[0]).toMatchObject({
      answer: -3,
    });
    expect(generateProblems([5], ["MULTIPLY"])[0]).toMatchObject({
      answer: 10,
    });
    expect(generateProblems([5], ["DIVIDE"])[0]).toMatchObject({
      answer: 2 / 5,
    });
  });

  it("scales with the number of operators and numbers", () => {
    const problems = generateProblems([2, 3], [...OPERATORS]);
    expect(problems).toHaveLength(11 * 2 * OPERATORS.length);
  });
});

describe("toString", () => {
  it("formats a problem with its operator symbol", () => {
    const problem: ProblemDefinition = {
      leftValue: 3,
      rightValue: 4,
      operator: "MULTIPLY",
      answer: 12,
    };
    expect(toString(problem)).toBe("3 × 4");
  });
});

describe("shuffleProblemListOrder", () => {
  it("returns a permutation of the input", () => {
    const problems = generateProblems([2, 3], ["ADD"]);
    const shuffled = shuffleProblemListOrder(problems);
    expect(shuffled).toHaveLength(problems.length);
    expect(new Set(shuffled)).toEqual(new Set(problems));
  });

  it("does not mutate the input list", () => {
    const problems = generateProblems([2], ["ADD"]);
    const copy = [...problems];
    shuffleProblemListOrder(problems);
    expect(problems).toEqual(copy);
  });

  it("actually reorders (first element varies across runs)", () => {
    const problems = generateProblems([2, 3, 4], ["ADD"]);
    const firsts = new Set<ProblemDefinition | undefined>();
    for (let run = 0; run < 100; run++) {
      firsts.add(shuffleProblemListOrder(problems)[0]);
    }
    // 100 shuffles of 33 problems landing on one first element is ~impossible.
    expect(firsts.size).toBeGreaterThan(1);
  });
});

describe("shuffleProblemListNumbers", () => {
  it("keeps every answer valid for commutative operators", () => {
    const problems = generateProblems([2, 3], ["ADD", "MULTIPLY"]);
    for (const shuffledProblem of shuffleProblemListNumbers(problems)) {
      const { leftValue, rightValue, operator, answer } = shuffledProblem;
      expect(
        operator === "ADD" ? leftValue + rightValue : leftValue * rightValue,
      ).toBe(answer);
    }
  });

  it("never swaps operands of non-commutative operators", () => {
    const problems = generateProblems([2, 3], ["SUBTRACT", "DIVIDE"]);
    expect(shuffleProblemListNumbers(problems)).toEqual(problems);
  });
});
