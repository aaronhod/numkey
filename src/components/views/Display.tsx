import type { ProblemDefinition } from "@/game/problem";
import { getOperatorChar } from "@/game/problem";
import { cn } from "@/utils/shad";
import React, { useEffect } from "react";
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
import type {
  GameMode,
  GameModifierName,
  GameSettings,
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
    if (isPaused) {
      return;
    }
    setRunningMs(TIMER_INTERVAL_MS);
  }, TIMER_INTERVAL_MS);

  const timeElapsed = dayjs.duration(runningMs, "milliseconds");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-baseline gap-2">
          <span>Time</span>
          <p className="text-foreground tabular-nums">
            {timeElapsed.format("mm:ss")}
          </p>
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
    <div className="flex items-baseline gap-2">
      <span>Left</span>
      <p className="text-foreground tabular-nums">
        {timeRemaining.asSeconds().toString().padStart(2, "0")}
      </p>
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
        <div className="flex items-baseline gap-2">
          <span>Rnd</span>
          <div className="text-foreground flex tabular-nums">{tallyString}</div>
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
  const GameModeIcon = <ModeIcon mode={gameMode} />;
  const ModifierIcons = Object.entries(gameModifiers)
    .map(([name, val]) => {
      if (!val.enabled) {
        return null;
      }
      return <ModifierIcon key={name} modifier={name as GameModifierName} />;
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
        <span
          key={`heart-${i}`}
          className={i < livesRemaining ? "text-foreground" : "opacity-30"}
        >
          ●
        </span>,
      );
    }
    return hearts.reverse();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex gap-1.5">{renderHearts()}</div>
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
  /** Opens the pause/settings menu (also reachable via Escape). */
  onOpenMenu: () => void;
}) => {
  return (
    <h3 className="text-muted-foreground flex items-baseline justify-between gap-4 border-b px-5 py-3 text-[11px] font-medium tracking-[0.08em] uppercase">
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
      <button
        onClick={props.onOpenMenu}
        aria-label="Open the pause menu and settings"
        className="hover:text-foreground tracking-[0.08em] uppercase transition-colors"
      >
        Menu ≡
      </button>
    </h3>
  );
};

export const DisplayContent = (props: {
  problem: ProblemDefinition | null;
  negativeMode: boolean;
  userValue: string | null;
  /** Brief full-area tint after an attempt — stronger for wrong answers,
   *  but never a full inversion, which read as a harsh white flash. */
  flash?: "correct" | "wrong" | null;
}) => {
  return (
    <h2
      className={cn(
        "my-auto flex w-full items-center p-5 text-3xl transition-colors duration-100 sm:text-5xl",
        {
          "bg-foreground/25": props.flash === "wrong",
          "bg-foreground/10": props.flash === "correct",
        },
      )}
    >
      {/* Cap the measure and center it so the problem and the input stay a
          readable distance apart instead of hugging opposite edges on wide
          screens; on small screens this is full width, as before. */}
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4">
        {props.problem && (
          <div className="flex min-w-fit gap-0.5 align-text-bottom text-inherit/75 sm:gap-4">
            <p>{props.problem?.leftValue}</p>
            <p>{getOperatorChar(props.problem?.operator)}</p>
            <p>{props.problem?.rightValue}</p>
          </div>
        )}
        <div className="flex max-w-[80%] cursor-default gap-1 bg-inherit text-right caret-transparent focus:cursor-default focus:ring-0 focus:outline-none sm:gap-4">
          <p>{props.negativeMode && "- "}</p>
          <p>{props.userValue}</p>
        </div>
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
