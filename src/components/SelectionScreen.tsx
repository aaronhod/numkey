// Screen for selecting a number from 2-12 and a math operator to use in the game.

import { useState } from "react";
import type { Operator } from "./numpad/Problem";

const SelectionScreen: React.FC = () => {
  const [selectedOperator, setSelectedOperator] = useState<Operator>("+");
  const [selectedNumber, setSelectedNumber] = useState<number>(2);

  const SquareButton = ({
    onClick,
    children,
    className,
  }: {
    onClick: () => void;
    children?: React.ReactNode;
    className?: string;
  }): JSX.Element => (
    <button
      className={`no-animation btn-square btn ${className!}`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const NumberSelect: React.FC<{ number: number }> = ({ number }) => (
    <SquareButton onClick={() => setSelectedNumber(number)}>
      {number}
    </SquareButton>
  );

  const OperatorSelect: React.FC<{ operator: Operator }> = ({ operator }) => (
    <SquareButton onClick={() => setSelectedOperator(operator)}>
      {operator}
    </SquareButton>
  );

  return (
    <div className="flex h-full flex-col">
      <h1>Select Options</h1>
      <div>
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
      <div>
        <OperatorSelect key="+" operator="+" />
        <OperatorSelect key="-" operator="-" />
        <OperatorSelect key="*" operator="*" />
        <OperatorSelect key="/" operator="/" />
      </div>
      <div>
        <button>Start</button>
      </div>
    </div>
  );
};

export { SelectionScreen };
