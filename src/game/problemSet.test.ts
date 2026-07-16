import { describe, expect, it } from "vitest";

import {
  asProblemSetId,
  DEFAULT_PROBLEM_SET_IDS,
  fromProblemSetId,
  isProblemSetId,
  makeProblemSetId,
} from "@/game/problemSet";

describe("problem set ids", () => {
  it("builds ids in OPERATOR_NUMBER form", () => {
    expect(makeProblemSetId(2, "ADD")).toBe("ADD_2");
    expect(makeProblemSetId(12, "DIVIDE")).toBe("DIVIDE_12");
  });

  it("rejects out-of-range numbers when building", () => {
    expect(() => makeProblemSetId(1, "ADD")).toThrow();
    expect(() => makeProblemSetId(13, "ADD")).toThrow();
  });

  it("validates set ids", () => {
    expect(isProblemSetId("ADD_2")).toBe(true);
    expect(isProblemSetId("MULTIPLY_12")).toBe(true);
    expect(isProblemSetId("BOGUS_2")).toBe(false); // unknown operator
    expect(isProblemSetId("ADD_1")).toBe(false); // number out of range
    expect(isProblemSetId("ADD")).toBe(false); // missing number
  });

  it("asProblemSetId returns valid ids and throws on invalid", () => {
    expect(asProblemSetId("ADD_2")).toBe("ADD_2");
    expect(() => asProblemSetId("nope")).toThrow();
  });

  it("expands a set id into its problems", () => {
    const problems = fromProblemSetId("ADD_2");
    expect(problems).toHaveLength(11);
    expect(
      problems.every((p) => p.operator === "ADD" && p.rightValue === 2),
    ).toBe(true);
  });

  it("provides a default set for every operator and number 2..12", () => {
    expect(DEFAULT_PROBLEM_SET_IDS).toHaveLength(4 * 11);
    expect(DEFAULT_PROBLEM_SET_IDS.every(isProblemSetId)).toBe(true);
  });
});
