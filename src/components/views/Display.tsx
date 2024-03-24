import type { ProblemDefinition } from "@/components/game/Problem";
import { getOperatorChar } from "@/components/game/Problem";
import { cn } from "@/utils/shad";
import React, { useEffect } from "react";
import {
  Clock,
  Heart,
  LucideInfinity,
  Tally5,
  Timer as TimerIcon,
} from "lucide-react";
import { Separator } from "@/components/shad-ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shad-ui/tooltip";

import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useInterval } from "@/hooks/useInterval";
import type { GameSettings } from "@/components/views/Game";
import type {
  GameMode,
  GameModifierName,
} from "@/components/views/GameSettings";
import { ModeIcon, ModifierIcon } from "@/components/views/GameSettings";

// add duration plugin for dayjs
dayjs.extend(duration);
dayjs.extend(relativeTime);

interface TimerProps {
  runningMs: number;
  setRunningMs: (ms: number) => void;
  isPaused: boolean;
  className?: string;
}

// Update every second
const TIMER_INTERVAL_MS = 1000;
const StopWatch = ({ runningMs, setRunningMs, isPaused }: TimerProps) => {
  useInterval(() => {
    if (isPaused) return;
    setRunningMs(TIMER_INTERVAL_MS);
  }, TIMER_INTERVAL_MS);

  const timeElapsed = dayjs.duration(runningMs, "milliseconds");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <Clock />
          <p>{timeElapsed.format("mm:ss")}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{`This game has been running for ${timeElapsed.humanize()}`}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const Timer = ({ remainingMs }: { remainingMs: number }) => {
  const timeRemaining = dayjs.duration(remainingMs, "milliseconds");

  return (
    <div className="flex items-center gap-2">
      <TimerIcon />
      <p>{timeRemaining.asSeconds().toString().padStart(2, "0")}</p>
    </div>
  );
};

const RoundTally = ({
  completed,
  total,
  gameMode,
}: {
  completed: number;
  total: number;
  gameMode?: GameMode;
}) => {
  const paddedCompleted = completed
    .toString()
    .padStart(total.toString().length, "0");

  let denominator: string = total.toString();
  if (gameMode === "endless") {
    denominator = "∞";
  }

  const tallyString = `${paddedCompleted}/${denominator}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <Tally5 />
          <div className="flex">
            <div>{paddedCompleted}/</div>
            {gameMode === "endless" ? (
              <LucideInfinity height="full" />
            ) : (
              <>{denominator}</>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tallyString} rounds completed</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SettingsDisplay = ({ settings }: { settings: GameSettings }) => {
  const { gameMode, gameModifiers } = settings;
  const GameModeIcon = <ModeIcon mode={gameMode} className="h-5 w-5" />;
  const ModifierIcons = Object.entries(gameModifiers)
    .map(([name, val]) => {
      if (!val.enabled) return null;
      return (
        <ModifierIcon
          key={name}
          modifier={name as GameModifierName}
          className="h-5 w-5"
        />
      );
    })
    .filter((icon) => icon !== null);

  return (
    <div className="flex items-center gap-2">
      {GameModeIcon}
      {ModifierIcons.length > 0 && (
        <>
          <Separator orientation="vertical" />
          {ModifierIcons}
        </>
      )}
    </div>
  );
};
const TOTAL_LIVES = 3;

const LivesDisplay = ({
  livesRemaining,
}: {
  livesRemaining: number | null;
}) => {
  if (livesRemaining === null) {
    return null;
  }

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < TOTAL_LIVES; i++) {
      hearts.push(
        <Heart
          key={`heart-${i}`}
          className={i < livesRemaining ? "fill-white" : ""}
        />,
      );
    }
    return hearts.reverse();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex">{renderHearts()}</div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{`${livesRemaining}/${TOTAL_LIVES}`} lives remaining</p>
      </TooltipContent>
    </Tooltip>
  );
};

interface DisplayProps {
  handleKeyDown: (e: KeyboardEvent) => void;
  negativeMode: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const DisplayHeader = (props: {
  completed: number;
  total: number;
  runningMs: number;
  setRunningMs: (ms: number) => void;
  paused: boolean;
  lives: number | null;
  settings: GameSettings;
  remainingMs: number | null;
}) => {
  return (
    <h3 className="flex justify-between px-5 pt-3 text-foreground/50 ">
      <RoundTally
        completed={props.completed}
        total={props.total}
        gameMode={props.settings.gameMode}
      />
      <StopWatch
        runningMs={props.runningMs}
        setRunningMs={props.setRunningMs}
        isPaused={props.paused}
      />
      {props.settings.gameModifiers.timed.enabled && (
        <Timer remainingMs={props.remainingMs!} />
      )}
      <LivesDisplay livesRemaining={props.lives} />
      <SettingsDisplay settings={props.settings} />
    </h3>
  );
};

export const DisplayContent = (props: {
  problem: ProblemDefinition | null;
  negativeMode: boolean;
  userValue: string | null;
}) => {
  return (
    <h2 className="my-auto flex w-full p-5 text-3xl sm:text-5xl">
      {props.problem && (
        <div className="text-inherit/75 flex w-full min-w-fit gap-0.5 self-center align-text-bottom sm:gap-4">
          <p>{props.problem?.leftValue}</p>
          <p>{getOperatorChar(props.problem?.operator)}</p>
          <p>{props.problem?.rightValue}</p>
        </div>
      )}
      <div className="flex max-w-[80%] cursor-default gap-1 self-center bg-inherit text-right caret-transparent focus:cursor-default focus:outline-none focus:ring-0 sm:gap-4">
        <p>{props.negativeMode && "- "}</p>
        <p>{props.userValue}</p>
      </div>
    </h2>
  );
};

const Display: React.FC<DisplayProps> = ({
  className,
  negativeMode,
  handleKeyDown,
  children,
}) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <TooltipProvider>
      <header
        className={cn(
          "flex flex-col",
          {
            "bg-accent": negativeMode,
          },
          className,
        )}
      >
        {children}
      </header>
    </TooltipProvider>
  );
};

export { Display };
