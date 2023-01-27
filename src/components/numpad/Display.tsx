import type { Problem } from "./Problem";

interface DisplayProps {
  problem: Problem;
  value: string;
}

function formatProblem(problem: Problem) {
  return `${problem.value1} ${problem.operator} ${problem.value2} = `;
}

const Display: React.FC<DisplayProps> = ({ problem, value }) => {
  return (
    <h1 className=" my-auto pl-16 pr-16 text-8xl">
      {`${formatProblem(problem)} ${value ?? ""}`}
    </h1>
  );
};

export { Display };
