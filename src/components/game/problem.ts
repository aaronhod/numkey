export type Operator = "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE";

export interface ProblemDefinition {
  leftValue: number;
  rightValue: number;
  operator: Operator;
  answer: number;
}

const MAX_NUM = 12;
const MIN_NUM = 2;

export function getOperatorChar(operator: Operator) {
  switch (operator) {
    case "ADD":
      return "+";
    case "SUBTRACT":
      return "-";
    case "MULTIPLY":
      return "×";
    case "DIVIDE":
      return "÷";
    default:
      throw new Error(`Unknown operator ${operator as string}`);
  }
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
        throw new Error(`Unknown operator ${operator as string}`);
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

export function shuffleProblemListOrder(problems: ProblemDefinition[]): ProblemDefinition[] {
  return problems
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function shuffleProblemListNumbers(problems: ProblemDefinition[]): ProblemDefinition[] {
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
