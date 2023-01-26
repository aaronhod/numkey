import type { Problem } from "./Problem";

type UiOperator = "+" | "-" | "÷" | "×";

interface DisplayProps {
  problem: Problem;
  value: string;
}

const MULTIPLY_CHAR = "×";
const DIVIDE_CHAR = "÷";

function formatOperator(operator: string): UiOperator {
  if (operator === "*") return MULTIPLY_CHAR;
  if (operator === "/") return DIVIDE_CHAR;
  return operator as UiOperator;
}

function formatOutput(problem: Problem) {
  const formattedOperator = formatOperator(problem.operator);
  return `${problem.value1} ${formattedOperator} ${problem.value2} = `;
}

const Display: React.FC<DisplayProps> = ({ problem, value }) => {
  return (
    <h1 className=" my-auto pl-16 pr-16 text-8xl">
      {`${formatOutput(problem)} ${value ?? ""}`}
    </h1>
  );
};

export { Display, formatOperator };
