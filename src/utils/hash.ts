import xxhash from "xxhash-wasm";
import {
  type Problem,
  type ProblemDefinition,
} from "@/game/problem";

const SEED = 21;

//eslint-disable-next-line @typescript-eslint/unbound-method
const { h32ToString } = await xxhash();

export const hashProblem = async (problem: Problem) => {
  const problemDef = {
    leftValue: problem.leftValue,
    rightValue: problem.rightValue,
    operator: problem.operator,
    answer: problem.answer,
  } satisfies ProblemDefinition;

  return hashProblemDef(problemDef);
};

export const hashProblems = async (problems: Problem[]): Promise<string[]> => {
  return Promise.all(problems.map(hashProblem));
};

export const hashProblemDef = async (problem: ProblemDefinition) => {
  const problemString = `${problem.leftValue}${problem.operator}${problem.rightValue}${problem.answer}`;
  return h32ToString(problemString, SEED);
};

export const hashProblemDefs = async (
  problems: ProblemDefinition[],
): Promise<string[]> => {
  return Promise.all(problems.map(hashProblemDef));
};
