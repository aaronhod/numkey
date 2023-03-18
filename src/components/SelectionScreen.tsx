import { useRouter } from "next/router";
import { useState } from "react";
import { getGameRouteSimple } from "../constants/routes";
import type { Operator } from "./numpad/Problem";

const SelectionScreen = () => {
  const [selectedOperator, setSelectedOperator] = useState<Operator>();
  const [selectedNumber, setSelectedNumber] = useState<number>();
  const router = useRouter();

  function startGame(operator: Operator, number: number): void {
    const gameRoute = getGameRouteSimple(number, operator);
    router.push(gameRoute).catch((err) =>  (console.error(err)));
  }

  const SelectButton = ({
    onClick,
    children,
    selectClass,
  }: {
    onClick: () => void;
    children?: React.ReactNode;
    selectClass?: string;
  }): JSX.Element => {
    return (
      <button
        className={`h-20 w-20 cursor-pointer rounded-md font-bold  ${
          selectClass ? selectClass : "bg-neutral hover:bg-neutral-focus"
        } `}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const NumberSelect: React.FC<{ number: number }> = ({ number }) => {
    const isSelected = selectedNumber === number;
    const selectedClass = isSelected ? "bg-secondary-focus" : undefined;
    return (
      <SelectButton
        onClick={() => setSelectedNumber(number)}
        selectClass={selectedClass}
      >
        {number}
      </SelectButton>
    );
  };

  const OperatorSelect: React.FC<{ operator: Operator }> = ({ operator }) => {
    const isSelected = selectedOperator === operator;
    const selectedClass = isSelected ? "bg-secondary-focus" : undefined;
    return (
      <SelectButton
        onClick={() => setSelectedOperator(operator)}
        selectClass={selectedClass}
      >
        {operator}
      </SelectButton>
    );
  };

  return (
    <div className="my-auto flex h-full flex-col items-center">
      <div className="mt-10 flex flex-wrap justify-center gap-4 px-28">
        <NumberSelect key={2} number={2} />
        <NumberSelect key={3} number={3} />
        <NumberSelect key={4} number={4} />
        <NumberSelect key={5} number={5} />
        <NumberSelect key={6} number={6} />
        <NumberSelect key={7} number={7} />
        <NumberSelect key={8} number={8} />
        <NumberSelect key={9} number={9} />
        <NumberSelect key={10} number={10} />
        <NumberSelect key={11} number={11} />
        <NumberSelect key={12} number={12} />
      </div>
      <div className="mt-10 flex flex-row gap-4">
        <OperatorSelect key="+" operator="+" />
        <OperatorSelect key="-" operator="-" />
        <OperatorSelect key="×" operator="×" />
        <OperatorSelect key="÷" operator="÷" />
      </div>
      <div className="mt-10 mb-72 p-6 text-3xl">
        <button
          className={`btn-secondary btn-wide btn ${
            !(selectedNumber && selectedOperator) ? "btn-disabled" : ""
          }`}
          onClick={() => startGame(selectedOperator!, selectedNumber!)}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export { SelectionScreen };
