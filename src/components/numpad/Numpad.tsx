import React, { ReactElement, useState } from "react";
import { BackSpaceIcon, SendIcon } from "../Icons";
import { ProblemWithAns, generateProblems, shuffleProblems } from "./Game";

type UiOperator = "+" | "-" | "÷" | "x";

const MULTIPLY_CHAR = "x";
const DIVIDE_CHAR = "÷";

function formatOutput(problem: ProblemWithAns) {
  let formattedOperator = problem.operator as UiOperator;
  if (problem.operator === "*") formattedOperator = MULTIPLY_CHAR;
  if (problem.operator === "/") formattedOperator = DIVIDE_CHAR;

  return `${problem.value1} ${formattedOperator} ${problem.value2} = `;
}

const Numpad: React.FC = () => {
  const testProblem: ProblemWithAns = {
    value1: 5,
    value2: 4,
    operator: "*",
    answer: 20,
  };

  const [value, setValue] = useState<string>("");

  function buttonClick(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    const newValue = target.value;

    if (newValue === "<") {
      if (value.length === 0) return;
      setValue((value) => value.slice(0, -1));
      return;
    }

    if (newValue === "C") {
      setValue("");
      return;
    }

    if (value.length >= 3) {
      return;
    }

    setValue((value) => value + newValue);
  }

  const NumpadBtn: React.FC<{ value: string; icon?: ReactElement }> = ({
    value,
    icon,
  }) => {
    return (
      <button
        className="h-40 border-2 border-[hsl(var(--b1))] bg-base-300 text-center text-3xl"
        value={value}
        onClick={buttonClick}
      >
        {icon ?? value}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col font-mono text-lg font-semibold">
      <h1 className=" mt-auto mb-auto pl-16 pr-16 text-8xl">
        {`${formatOutput(testProblem)} ${value ? value : "?"}`}
      </h1>
      <div className="mt-auto grid grid-cols-3">
        <NumpadBtn value="1" />
        <NumpadBtn value="2" />
        <NumpadBtn value="3" />

        <NumpadBtn value="4" />
        <NumpadBtn value="5" />
        <NumpadBtn value="6" />

        <NumpadBtn value="7" />
        <NumpadBtn value="8" />
        <NumpadBtn value="9" />

        <NumpadBtn
          value="<"
          icon={<BackSpaceIcon className="ml-auto mr-auto h-10 w-10" />}
        />
        <NumpadBtn value="0" />
        <NumpadBtn value="C" />
      </div>
    </div>
  );
};

export { Numpad as default };
