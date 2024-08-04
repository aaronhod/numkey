import {
  BASIC_MAX_NUM,
  BASIC_MIN_NUM,
  generateProblems,
  type Operator,
  OPERATORS,
  type ProblemDefinition,
} from "@/game/problem";

export type ProblemSetId = string;

export const DEFAULT_PROBLEM_SET_IDS: ProblemSetId[] =
  createDefaultProblemSets();

function createDefaultProblemSets(): ProblemSetId[] {
  const problemSets: ProblemSetId[] = [];
  for (const operator of OPERATORS) {
    for (let i = BASIC_MIN_NUM; i <= BASIC_MAX_NUM; i++) {
      problemSets.push(makeProblemSetId(i, operator));
    }
  }

  return problemSets;
}

export function makeProblemSetId(
  number: number,
  operator: Operator,
): ProblemSetId {
  if (number < BASIC_MIN_NUM || number > BASIC_MAX_NUM) {
    throw new Error(`Invalid number ${number}`);
  }

  return `${operator}_${number}`;
}

export function isProblemSetId(str: string): boolean {
  const [operator, number] = str.split("_");
  if (operator === undefined || number === undefined) {
    return false;
  }

  if (OPERATORS.find((op) => op === operator) === undefined) {
    return false;
  }

  const parsedNumber = parseInt(number, 10);
  if (
    Number.isNaN(parsedNumber) ||
    parsedNumber < BASIC_MIN_NUM ||
    parsedNumber > BASIC_MAX_NUM
  ) {
    return false;
  }

  return true;
}

export function asProblemSetId(str: string): ProblemSetId {
  if (!isProblemSetId(str)) {
    throw new Error(`Invalid problem set id ${str}`);
  }

  return str;
}

export function fromProblemSetId(
  problemSetId: ProblemSetId,
): ProblemDefinition[] {
  const [operator, number] = problemSetId.split("_");
  if (operator === undefined || number === undefined) {
    throw new Error(`Invalid problem set id ${problemSetId}`);
  }
  if (OPERATORS.find((op) => op === operator) === undefined) {
    throw new Error(`Unknown operator ${operator}`);
  }

  const parsedNumber = parseInt(number, 10);
  if (
    Number.isNaN(parsedNumber) ||
    parsedNumber < BASIC_MIN_NUM ||
    parsedNumber > BASIC_MAX_NUM
  ) {
    throw new Error(`Unknown number ${number}`);
  }

  return generateProblems([parsedNumber], [operator as Operator]);
}
