import type { Problem } from "./Problem";
import { cn } from "@/utils/shad";
import React, { useEffect } from "react";

interface DisplayProps {
  className?: string;
  problem: Problem | null;
  value: string | null;
  negativeMode: boolean;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function getDisplayValue(value: string | null, negativeMode: boolean) {
  if (value === null) {
    return "";
  }

  if (negativeMode) {
    return `- ${value}`;
  }

  return value;
}

const Display: React.FC<DisplayProps> = ({
  className,
  problem,
  value,
  negativeMode,
  handleKeyDown,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [value, negativeMode, problem]);

  return (
    <h1
      className={cn(
        "my-auto flex p-5 text-3xl sm:text-5xl",
        {
          "bg-accent": negativeMode,
        },
        className,
      )}
    >
      <p className="self-center align-text-bottom text-white/75">
        {problem &&
          `${problem.leftValue} ${problem.operator} ${problem.rightValue}`}
      </p>
      <input
        autoFocus
        type="text"
        value={getDisplayValue(value, negativeMode)}
        className="grow cursor-default self-center bg-inherit text-right caret-transparent focus:cursor-default focus:outline-none focus:ring-0"
        onKeyDown={handleKeyDown}
        // always set the focus back to the input after focusing on another component
        onBlur={(e) => e.target.focus()}
        ref={inputRef}
      />
    </h1>
  );
};

export { Display };
