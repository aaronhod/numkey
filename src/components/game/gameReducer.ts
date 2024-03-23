import type { Problem } from "@/components/game/Problem";
import type { GameRoundAttempt, GameSettings } from "@/components/game/Game";
import { isCorrectAnswer } from "@/components/game/Game";
import type { FinishedRound } from "@/server/api/routers/games";
import dayjs from "dayjs";

type ProblemAttempts = Map<number, GameRoundAttempt>;
type ProblemQueue = {
  problem: Problem;
  attempts: ProblemAttempts;
}[];

export interface State {
  startedAt: Date;
  inputValue: string | null;
  prevInputValue: string;
  negativeMode: boolean;
  problemQueue: ProblemQueue;
  finishedProblems: FinishedRound[];
  allCompleted: boolean;
  stopWatchMs: number;
  timerMs: number | null;
  lives: number | null;
  onGameComplete?: () => void;
}

export type Action =
  | {
      type: "input-insert";
      value: string;
    }
  | {
      type: "input-remove";
    }
  | {
      type: "input-toggle-negative";
      value: ToggleChar;
    }
  | {
      type: "add-attempt";
      value?: number;
    }
  | {
      type: "update-timer";
      value: number;
    };

type ToggleChar = "+" | "-";

export const initialGameState = (
  problemSet: Problem[],
  settings: GameSettings,
): State => {
  const mappedProblems = problemSet.map((problem) => ({
    problem,
    attempts: new Map(),
  }));

  const timerStartMs = settings.gameModifiers.timed.enabled
    ? settings.gameModifiers.timed.durationSeconds ?? DEFAULT_MAX_SECONDS * 1000
    : null;

  return {
    startedAt: new Date(),
    inputValue: null,
    prevInputValue: "",
    negativeMode: false,
    problemQueue: mappedProblems,
    finishedProblems: [],
    allCompleted: false,
    stopWatchMs: 0,
    timerMs: timerStartMs,
    lives: settings.gameMode === "lives" ? 3 : null,
  };
};

export const gameReducer =
  (settings: GameSettings) =>
  (state: State, action: Action): State => {
    switch (action.type) {
      case "input-insert":
        return insertCharacter(action.value, state);
      case "input-remove":
        return removeCharacter(state);
      case "input-toggle-negative":
        return toggleNegativeInput(action.value, state);
      case "add-attempt":
        return addRoundAttempt(action.value, state, settings);
      case "update-timer":
        return updateRunningSeconds(action.value, state, settings);
      default:
        return state;
    }
  };

function insertCharacter(newValue: string, state: State): State {
  const asNumber = Number(newValue);
  const validValue =
    (Number.isFinite(asNumber) && asNumber >= 0 && asNumber <= 9) ||
    newValue === ".";

  if ((state.inputValue?.length ?? 0) + 1 > 10) {
    return state;
  }

  if (validValue) {
    return {
      ...state,
      inputValue: [state.inputValue, newValue].join(""),
      prevInputValue: [state.prevInputValue, state.inputValue ?? ""].join(""),
    };
  }

  return state;
}

function removeCharacter(state: State): State {
  return {
    ...state,
    inputValue: state.inputValue?.slice(0, -1) ?? null,
    prevInputValue: state.prevInputValue?.slice(0, -1) ?? "",
  };
}

// - is a toggle, + is a reset
function toggleNegativeInput(toggleChar: ToggleChar, state: State): State {
  if (toggleChar === "-") {
    return {
      ...state,
      negativeMode: !state.negativeMode,
    };
  }

  // toggleChar === '+'
  return {
    ...state,
    negativeMode: false,
  };
}

// handle implicit and explicit attempts
function addRoundAttempt(
  answer: number | undefined,
  state: State,
  settings: GameSettings,
): State {
  if (state.problemQueue.length === 0) {
    return state;
  }

  const currentProblem = state.problemQueue[0]!;
  const currentProblemAttempts = currentProblem?.attempts ?? new Map();

  const currentProblemAttemptsDuration = Object.values(
    currentProblemAttempts,
  ).reduce(
    (acc: number, curr: GameRoundAttempt) => (acc += curr.msElapsed),
    0,
  ) as number;
  const allFinishedProblemsDuration = state.finishedProblems.reduce(
    (acc, curr) => (acc += curr.durationMs),
    0,
  );

  const currentAttemptDuration =
    dayjs().diff(state.startedAt, "millisecond") -
    (currentProblemAttemptsDuration + allFinishedProblemsDuration);

  const updatedAttempts = new Map<number, GameRoundAttempt>(
    currentProblemAttempts,
  ).set(currentProblemAttempts?.size ?? 0, {
    value: answer ?? Number(state.inputValue),
    msElapsed: currentAttemptDuration,
  });

  const wrongAnswer =
    !answer ||
    !currentProblem ||
    !isCorrectAnswer(currentProblem.problem.answer, answer, state.negativeMode);

  if (wrongAnswer) {
    return handleWrongAnswer(state, currentProblem, updatedAttempts, settings);
  }

  return finishRound(updatedAttempts, state, currentProblem, settings);
}

function finishRound(
  updatedAttempts: Map<number, GameRoundAttempt>,
  state: State,
  currentProblem: {
    problem: Problem;
    attempts: ProblemAttempts;
  },
  settings: GameSettings,
  queueNext = true,
) {
  const mappedAttempts = Array.from(
    updatedAttempts.entries(),
    ([ordering, { value }]) => ({
      ordering,
      value,
    }),
  );

  // no remaining problems to solve, so all are completed
  const allCompleted = state.problemQueue.length === 1;
  const totalDuration = Array.from(updatedAttempts.values()).reduce(
    (acc, problem) => acc + problem.msElapsed,
    0,
  );

  return {
    ...state,
    problemQueue: queueNext ? state.problemQueue.slice(1) : state.problemQueue,
    inputValue: allCompleted ? "Done!" : null,
    prevInputValue: "",
    allCompleted: allCompleted,
    timerMs: settings.gameModifiers.timed.enabled
      ? settings.gameModifiers.timed.durationSeconds ??
        DEFAULT_MAX_SECONDS * 1000
      : null,
    finishedProblems: [
      ...state.finishedProblems,
      {
        ...currentProblem.problem,
        isCompleted: true,
        durationMs: totalDuration,
        attempts: mappedAttempts,
      },
    ],
  };
}

function handleWrongAnswer(
  state: State,
  currentProblem: {
    problem: Problem;
    attempts: ProblemAttempts;
  },
  updatedAttempts: Map<number, GameRoundAttempt>,
  settings: GameSettings,
): State {
  const queueWithNewAttempt = state.problemQueue.map((p) => {
    if (p.problem === currentProblem.problem) {
      return {
        ...p,
        attempts: updatedAttempts,
      };
    }
    return p;
  });

  const updatedState = {
    ...(settings.nextOnFail
      ? finishRound(updatedAttempts, state, currentProblem, settings, false)
      : state),
    inputValue: null,
    prevInputValue: "",
    problemQueue: queueWithNewAttempt,
  };

  if (settings.gameMode === "lives") {
    const livesRemaining = (state.lives?.valueOf() ?? 0) - 1;
    const gameIsOver = livesRemaining === 0;
    const totalDuration = Array.from(updatedAttempts.values()).reduce(
      (acc, problem) => acc + problem.msElapsed,
      0,
    );

    const finishedAndRemainingProblems = [
      ...state.finishedProblems,
      {
        ...currentProblem.problem,
        isCompleted: false,
        durationMs: totalDuration,
        attempts: Array.from(
          updatedAttempts.entries(),
          ([ordering, { value }]) => ({
            ordering,
            value,
          }),
        ),
      },
      ...state.problemQueue.slice(1).map((p) => ({
        ...p.problem,
        isCompleted: false,
        durationMs: 0,
        attempts: [],
      })),
    ];

    return {
      ...updatedState,
      lives: livesRemaining,
      allCompleted: gameIsOver,
      finishedProblems: gameIsOver
        ? finishedAndRemainingProblems
        : state.finishedProblems,
    };
  }

  if (settings.gameMode === "stack") {
    const isLastProblem = state.problemQueue.length === 1;

    if (isLastProblem) {
      return {
        ...updatedState,
        problemQueue: queueWithNewAttempt,
      };
    }

    // move problem to end of queue
    const queueWithCurrentProblemAtEnd = [
      ...queueWithNewAttempt.slice(1),
      queueWithNewAttempt[0]!,
    ];

    return {
      ...updatedState,
      problemQueue: queueWithCurrentProblemAtEnd,
    };
  }

  return updatedState;
}

const DEFAULT_MAX_SECONDS = 10;

function updateRunningSeconds(
  deltaMilliseconds: number,
  state: State,
  settings: GameSettings,
): State {
  const updatedStopWatchTime = state.stopWatchMs + deltaMilliseconds;
  let timerIsExpired = false;
  let updatedTimerTime = null;
  if (settings.gameModifiers.timed.enabled) {
    updatedTimerTime = state.timerMs! - deltaMilliseconds;
    if (updatedTimerTime <= 0) {
      timerIsExpired = true;
      updatedTimerTime = settings.gameModifiers.timed.durationSeconds
        ? settings.gameModifiers.timed.durationSeconds * 1000
        : DEFAULT_MAX_SECONDS * 1000;
    }
  }

  const updatedTimeState = {
    ...state,
    stopWatchMs: updatedStopWatchTime,
    timerMs: updatedTimerTime,
  };

  if (timerIsExpired) {
    return addRoundAttempt(undefined, updatedTimeState, settings);
  }

  return updatedTimeState;
}
