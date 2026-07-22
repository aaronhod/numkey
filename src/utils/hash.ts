import { h32ToString } from "@/utils/xxh32";
import { type Problem, type ProblemDefinition } from "@/game/problem";
import { type ssgHelper } from "@/server/ssgHelper";
import { fromProblemSetId, type ProblemSetId } from "@/game/problemSet";

const SEED = 21;

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

export const getProblemsFromSetId = async (
  setId: ProblemSetId,
  helpers: Awaited<ReturnType<typeof ssgHelper>>,
): Promise<Problem[]> => {
  const problemDefs = fromProblemSetId(setId);
  const problemHashes = await hashProblemDefs(problemDefs);
  const problems = await helpers.game.findProblemsByHash.fetch(problemHashes);
  return sortByHashOrder(problems, problemHashes);
};

/**
 * `hash IN (...)` returns rows in whatever order the database picks; restore
 * the requested (generation) order so problem sets run sequentially unless a
 * modifier shuffles them. Hashes with no matching row are skipped.
 */
export const sortByHashOrder = (
  problems: Problem[],
  hashes: string[],
): Problem[] => {
  const byHash = new Map(problems.map((problem) => [problem.hash, problem]));
  return hashes
    .map((hash) => byHash.get(hash))
    .filter((problem): problem is Problem => problem !== undefined);
};
