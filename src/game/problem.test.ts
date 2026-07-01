import { describe, expect, it } from "vitest";

import {
  generateProblems,
  getOperatorChar,
  OPERATORS,
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
