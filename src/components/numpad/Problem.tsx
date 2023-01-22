/* eslint-disable @typescript-eslint/no-non-null-assertion */
type Operator = "+" | "-" | "*" | "/";

interface Problem {
  value1: number;
  value2: number;
  operator: Operator;
}

interface ProblemWithAns extends Problem {
  answer: number;
}

const MAX_NUM = 12;

function solveProblem(problem: Problem): ProblemWithAns {
  const { value1, value2, operator } = problem;
  let answer: number;

  switch (operator) {
    case "+":
      answer = value1 + value2;
      break;
    case "-":
      answer = value1 - value2;
      break;
    case "*":
      answer = value1 * value2;
      break;
    case "/":
      answer = value1 / value2;
      break;
    default:
      throw new Error("Invalid operator");
  }

  return {
    value1: value1,
    value2: value2,
    operator: operator,
    answer: answer,
  };
}

function generateProblems(
  number: number,
  operator: Operator
): ProblemWithAns[] {
  const problems: ProblemWithAns[] = [];

  for (let i = 1; i < MAX_NUM + 1; i++) {
    problems.push(solveProblem({ value1: i, value2: number, operator }));
  }

  return problems;
}

function shuffleProblems(problems: Problem[]): Problem[] {
  return problems.sort(() => Math.random() - 0.5).map(shuffleProblem);
}

function shuffleProblem(problem: Problem): Problem {
  const { value1, value2 } = problem;
  const rand = Math.random();

  if (rand < 0.5) {
    return {
      ...problem,
      value1: value2,
      value2: value1,
      operator: problem.operator,
    };
  }

  return problem;
}

export type { Operator, Problem, ProblemWithAns };
export { generateProblems, shuffleProblem, shuffleProblems };
