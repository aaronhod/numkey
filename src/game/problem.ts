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

export const BASIC_MAX_NUM = 12;
export const BASIC_MIN_NUM = 2;

export function toString(problem: ProblemDefinition): string {
  return `${problem.leftValue} ${getOperatorChar(problem.operator)} ${problem.rightValue}`;
}

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
      for (let i = BASIC_MIN_NUM; i < BASIC_MAX_NUM + 1; i++) {
        problems.push(
          createProblem({ leftValue: i, rightValue: number, operator }),
        );
      }
    }
  }

  return problems;
}

export function shuffleProblemListOrderAndNumbers<T extends ProblemDefinition>(
  problems: T[],
): T[] {
  return shuffleProblemListNumbers(shuffleProblemListOrder(problems));
}

// Fisher–Yates: uniform, unlike sorting by a random comparator, which is
// biased and left lists close to their original (sequential) order.
export function shuffleProblemListOrder<T extends ProblemDefinition>(
  problems: T[],
): T[] {
  const shuffled = [...problems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function shuffleProblemListNumbers<T extends ProblemDefinition>(
  problems: T[],
): T[] {
  return problems.map((problem) => shuffleProblemNumbers(problem));
}

function shuffleProblemNumbers<T extends ProblemDefinition>(problem: T): T {
  const { leftValue, rightValue } = problem;

  // Swapping operands only preserves the answer for commutative operators.
  if (problem.operator === "SUBTRACT" || problem.operator === "DIVIDE") {
    return problem;
  }

  if (Math.random() < 0.5) {
    return {
      ...problem,
      leftValue: rightValue,
      rightValue: leftValue,
      operator: problem.operator,
    };
  }

  return problem;
}
