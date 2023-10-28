import type { Problem } from "./Problem";
import { cn } from "@/utils/shad";
import React from "react";

interface DisplayProps {
  className?: string;
  problem: Problem | null;
  value: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Display: React.FC<DisplayProps> = ({
  className,
  problem,
  value,
  handleKeyDown,
}) => {
  return (
    <h1 className={cn("my-auto flex p-5 text-3xl sm:text-5xl", className)}>
      <p className="self-center align-text-bottom text-white/75">
        {problem &&
          `${problem.leftValue} ${problem.operator} ${problem.rightValue}`}
      </p>
      <input
        autoFocus
        type="text"
        value={value ?? ""}
        className="grow cursor-default self-center bg-background text-right caret-transparent focus:cursor-default focus:outline-none focus:ring-0"
        onKeyDown={handleKeyDown}
      />
    </h1>
  );
};

export { Display };
