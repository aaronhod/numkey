import type { Problem } from "./Problem";
import { getOperatorChar } from "./Problem";
import { cn } from "@/utils/shad";
import React, { useEffect } from "react";
import { Calculator, Dice6, Heart, Layers, Tally5, Timer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GameSettings } from "@/components/game/Game";
import type { Duration } from "dayjs/plugin/duration";


import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

// add duration plugin for dayjs
dayjs.extend(duration);
dayjs.extend(relativeTime);

interface DisplayProps {
  className?: string;
  problem: Problem | null;
  value: string | null;
  negativeMode: boolean;
  gameSettings: GameSettings;
  handleKeyDown: (e: KeyboardEvent) => void;
  roundsCompleted: number;
  totalRounds: number;
  timeElapsed: Duration;
  lives?: number;
}

const ElapsedTimer = ({ timeElapsed }: { timeElapsed: Duration }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <Timer />
          <p>{timeElapsed.format("mm:ss")}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{`This game has been running for ${timeElapsed.humanize()}`}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const RoundTally = ({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) => {
  const tallyString = `${completed}/${total}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <p className="flex items-center gap-2">
          <Tally5 />
          <p>{tallyString}</p>
        </p>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tallyString} rounds completed</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SettingsDisplay = () => {
  return (
    <div className="flex items-center gap-2">
      {/*gamemode*/}
      <Calculator />
      <Separator orientation="vertical" />
      <Layers />
      <Dice6 />
      {/*modifiers*/}
    </div>
  );
};
const TOTAL_LIVES = 3;

const LivesDisplay = ({ lives }: { lives?: number }) => {
  if (lives === undefined) {
    return null;
  }

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < TOTAL_LIVES; i++) {
      hearts.push(<Heart className={i < lives ? "" : "fill-white"} />);
    }
    return hearts;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex">{renderHearts()}</div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{`${lives}/${TOTAL_LIVES}`} lives remaining</p>
      </TooltipContent>
    </Tooltip>
  );
};

const Display: React.FC<DisplayProps> = ({
  className,
  problem,
  value,
  negativeMode,
  handleKeyDown,
  roundsCompleted,
  totalRounds,
  timeElapsed,
  lives,
}) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <TooltipProvider>
      <h1
        className={cn(
          "flex flex-col",
          {
            "bg-accent": negativeMode,
          },
          className,
        )}
      >
        {/*extra details: game mode specific info and time elapsed*/}
        <h3 className="flex justify-between px-5 pt-3 text-foreground/50 ">
          <RoundTally completed={roundsCompleted} total={totalRounds} />
          <ElapsedTimer timeElapsed={timeElapsed} />
          <SettingsDisplay />
          <LivesDisplay lives={lives} />
        </h3>
        {/*main display: problem and user input*/}
        <h2 className="my-auto flex w-full p-5 text-3xl sm:text-5xl">
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
        </h2>
      </h1>
    </TooltipProvider>
  );
};

export { Display };
