export const OPERATORS = ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE"] as const;
export const OPERATOR_CHARS = ["+", "-", "×", "÷"] as const;

export type Operator = (typeof OPERATORS)[number];
export type OperatorChar = (typeof OPERATOR_CHARS)[number];

export const OPERATOR_CHAR_MAP: Record<Operator, OperatorChar> = {
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "×",
  DIVIDE: "÷",
};

export interface ProblemDefinition {
  leftValue: number;
  rightValue: number;
  operator: Operator;
  answer: number;
}

export interface Problem extends ProblemDefinition {
  id: number;
  hash: string;
}

const MAX_NUM = 12;
const MIN_NUM = 2;

export function getOperatorChar(operator: Operator) {
  const operatorChar = OPERATOR_CHAR_MAP[operator];
  if (!operatorChar) {
    throw new Error(`Unknown operator ${operator}`);
  }
  return operatorChar;
}

function createProblem({
  leftValue,
  rightValue,
  operator,
}: Omit<ProblemDefinition, "answer">): ProblemDefinition {
  const calculateAnswer = () => {
    switch (operator) {
      case "ADD":
        return leftValue + rightValue;
      case "SUBTRACT":
        return leftValue - rightValue;
      case "MULTIPLY":
        return leftValue * rightValue;
      case "DIVIDE":
        return leftValue / rightValue;
      default:
        throw new Error(`Unknown operator ${operator}`);
    }
  };

  return {
    leftValue: leftValue,
    rightValue: rightValue,
    operator: operator,
    answer: calculateAnswer(),
  };
}

export function generateProblems(
  numbers: number[],
  operators: Operator[],
): ProblemDefinition[] {
  const problems: ProblemDefinition[] = [];

  for (const operator of operators) {
    for (const number of numbers) {
      for (let i = MIN_NUM; i < MAX_NUM + 1; i++) {
        problems.push(
          createProblem({ leftValue: i, rightValue: number, operator }),
        );
      }
    }
  }

  return problems;
}

export function shuffleProblemListOrderAndNumbers(
  problems: ProblemDefinition[],
): ProblemDefinition[] {
  return shuffleProblemListNumbers(shuffleProblemListOrder(problems));
}

export function shuffleProblemListOrder(
  problems: ProblemDefinition[],
): ProblemDefinition[] {
  return problems
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function shuffleProblemListNumbers(
  problems: ProblemDefinition[],
): ProblemDefinition[] {
  return problems.map((problem) => shuffleProblemNumbers(problem));
}

function shuffleProblemNumbers(problem: ProblemDefinition): ProblemDefinition {
  const { leftValue, rightValue } = problem;
  const rand = Math.random();

  if (rand < 0.5) {
    return {
      ...problem,
      leftValue: rightValue,
      rightValue: leftValue,
      operator: problem.operator,
    };
  }

  return problem;
}

export function fromProblemSetId(problemSetId: string): ProblemDefinition[] {
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
    parsedNumber < MIN_NUM ||
    parsedNumber > MAX_NUM
  ) {
    throw new Error(`Unknown number ${number}`);
  }

  return generateProblems([parsedNumber], [operator as Operator]);
}
