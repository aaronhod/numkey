import type { Problem } from "./Problem";
import { getOperatorChar } from "./Problem";
import { cn } from "@/utils/shad";
import React, { useEffect } from "react";

interface DisplayProps {
  className?: string;
  problem: Problem | null;
  value: string | null;
  negativeMode: boolean;
  handleKeyDown: (e: KeyboardEvent) => void;
}

const Display: React.FC<DisplayProps> = ({
  className,
  problem,
  value,
  negativeMode,
  handleKeyDown,
}) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <h1
      className={cn(
        "my-auto flex w-full p-5 text-3xl sm:text-5xl",
        {
          "bg-accent": negativeMode,
        },
        className,
      )}
    >
      {problem && (
        <div className="text-inherit/75 flex w-full min-w-fit gap-0.5 self-center align-text-bottom sm:gap-4">
          <p>{problem.leftValue}</p>
          <p>{getOperatorChar(problem.operator)}</p>
          <p>{problem.rightValue}</p>
        </div>
      )}
      <div className="flex max-w-[80%] cursor-default gap-1 self-center bg-inherit text-right caret-transparent focus:cursor-default focus:outline-none focus:ring-0 sm:gap-4">
        <p>{negativeMode && "- "}</p>
        <p>{value}</p>
      </div>
    </h1>
  );
};

export { Display };
