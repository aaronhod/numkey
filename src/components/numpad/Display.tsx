import type { Problem } from "./Problem";

type UiOperator = "+" | "-" | "÷" | "x";

interface DisplayProps {
  problem: Problem;
  value: string;
}

const MULTIPLY_CHAR = "x";
const DIVIDE_CHAR = "÷";

function formatOutput(problem: Problem) {
  let formattedOperator = problem.operator as UiOperator;
  if (problem.operator === "*") formattedOperator = MULTIPLY_CHAR;
  if (problem.operator === "/") formattedOperator = DIVIDE_CHAR;

  return `${problem.value1} ${formattedOperator} ${problem.value2} = `;
}

const Display: React.FC<DisplayProps> = ({ problem, value }) => {
  return (
    <h1 className=" my-auto pl-16 pr-16 text-8xl">
      {`${formatOutput(problem)} ${value ?? ""}`}
    </h1>
  );
};

export { Display };
