import {
  type GameCategory,
  type GameSettings,
} from "@/components/views/GameSettings";
import newGameInstance, {
  addAttempt,
  type GameInstance,
} from "@/game/gameInstance";
import { type Problem } from "@/game/problem";

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
      type: "update-timer";
      value: number;
    }
  | {
      type: "pause-game";
      value?: boolean;
    };

type ToggleChar = "+" | "-";

export type AttemptOutcome = "correct" | "wrong";

export interface AttemptFeedback {
  outcome: AttemptOutcome;
  /** Increments on every attempt so consumers can react to repeats. */
  seq: number;
}

export const MAX_INPUT_LENGTH = 10;

export interface GameReducerState {
  game: GameInstance;
  inputValue: string | null;
  negativeMode: boolean;
  /**
   * Set whenever an attempt is submitted (auto-submitted on the keystroke
   * that completes the input, or by timer expiry).
   */
  feedback: AttemptFeedback | null;
  /**
   * The time in milliseconds that the game has been running for
   */
  gameStopWatchMs: number;
  /**
   * The remaining time in milliseconds to complete the current problem
   */
  problemTimerMs?: number;
}

export const initialGameState = (
  playerId: string,
  problemSet: Problem[],
  category: GameCategory,
  settings: GameSettings,
): GameReducerState => {
  const gameInstance = newGameInstance(
    playerId,
    category,
    settings,
    3,
    new Date(),
    problemSet,
  );

  return {
    game: gameInstance,
    inputValue: null,
    negativeMode: false,
    feedback: null,
    gameStopWatchMs: 0,
    problemTimerMs: settings.gameModifiers.timed.enabled
      ? settings.gameModifiers.timed.durationSeconds * 1000
      : undefined,
  };
};

export const gameReducer =
  (settings?: GameSettings) =>
  (state: GameReducerState, action: Action): GameReducerState => {
    switch (action.type) {
      case "input-insert":
        return insertCharacter(state, action.value);
      case "input-remove":
        return removeCharacter(state);
      case "input-toggle-negative":
        return toggleNegativeInput(state, action.value);
      case "update-timer":
        return updateRunningSeconds(state, action.value, settings);
      case "pause-game":
        return togglePausedGame(state, action.value);
      default:
        return state;
    }
  };

function togglePausedGame(
  state: GameReducerState,
  newPauseState?: boolean,
): GameReducerState {
  const isPaused = newPauseState ?? !state.game.pause.isPaused;

  const updatedPauseMenu = {
    isPaused,
    startedAt: isPaused ? new Date() : state.game.pause.startedAt,
    endedAt: !isPaused ? new Date() : state.game.pause.endedAt,
  };

  return {
    ...state,
    game: {
      ...state.game,
      pause: updatedPauseMenu,
    },
  };
}

type CandidateOutcome = "correct" | "wrong" | "incomplete";

/**
 * Judge a typed value against the answer. An attempt is complete once the
 * input has as many characters as the answer (ignoring the sign, which is
 * entered via negative mode): "4" answers 1-digit problems, "123" answers
 * 3-digit problems, "1.5" answers "1.5"-shaped problems.
 *
 * A correct value is accepted as soon as it matches numerically, even below
 * the full length (e.g. ".875" for 0.875).
 */
export function evaluateCandidate(
  answer: number,
  candidate: string,
  negativeMode: boolean,
): CandidateOutcome {
  const value = Number(candidate) * (negativeMode ? -1 : 1);
  if (Number.isNaN(value)) {
    // A lone "." — not a number yet.
    return "incomplete";
  }
  if (value === answer) {
    return "correct";
  }

  const answerChars = Math.abs(answer).toString();
  if (answerChars.length > MAX_INPUT_LENGTH) {
    // Non-terminating decimals (e.g. 2 ÷ 3) can never be typed exactly, so
    // accept the first MAX_INPUT_LENGTH characters of the answer instead.
    const signMatches = negativeMode === answer < 0;
    if (signMatches && answerChars.startsWith(candidate)) {
      return candidate.length === MAX_INPUT_LENGTH ? "correct" : "incomplete";
    }
    return candidate.length >= MAX_INPUT_LENGTH ? "wrong" : "incomplete";
  }

  return candidate.length >= answerChars.length ? "wrong" : "incomplete";
}

function insertCharacter(
  state: GameReducerState,
  newChar: string,
): GameReducerState {
  const isDigit = newChar.length === 1 && newChar >= "0" && newChar <= "9";
  const isDot = newChar === "." && !(state.inputValue ?? "").includes(".");
  if (!isDigit && !isDot) {
    return state;
  }

  const candidate = (state.inputValue ?? "") + newChar;
  if (candidate.length > MAX_INPUT_LENGTH) {
    return state;
  }

  const problem = state.game.currentProblem;
  if (problem && state.game.state === "running" && !state.game.pause.isPaused) {
    const outcome = evaluateCandidate(
      problem.answer,
      candidate,
      state.negativeMode,
    );
    if (outcome === "correct") {
      // Pass the unsigned answer: addRoundAttempt applies negative mode.
      return addRoundAttempt(state, Math.abs(problem.answer));
    }
    if (outcome === "wrong") {
      return addRoundAttempt(state, Number(candidate));
    }
  }

  return {
    ...state,
    inputValue: candidate,
  };
}

function removeCharacter(state: GameReducerState): GameReducerState {
  const trimmed = state.inputValue?.slice(0, -1) ?? null;
  return {
    ...state,
    inputValue: trimmed === "" ? null : trimmed,
  };
}

// - is a toggle, + is a reset
function toggleNegativeInput(
  state: GameReducerState,
  toggleChar: ToggleChar,
): GameReducerState {
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

function addRoundAttempt(
  state: GameReducerState,
  answer: number | undefined,
): GameReducerState {
  if (!state.game.currentProblem) {
    return state;
  }

  let ans = answer;
  if (ans !== undefined && state.negativeMode) {
    ans = -ans;
  }

  const isCorrect =
    ans !== undefined && state.game.currentProblem.answer === ans;
  const game = addAttempt(structuredClone(state.game), ans);

  // The input always clears after an attempt: a correct answer advances to
  // the next problem, a wrong one restarts the same problem from scratch.
  return {
    ...state,
    game,
    inputValue: game.state === "finished" && isCorrect ? "Done!" : null,
    negativeMode: false,
    feedback: {
      outcome: isCorrect ? "correct" : "wrong",
      seq: (state.feedback?.seq ?? 0) + 1,
    },
  };
}

const DEFAULT_MAX_SECONDS = 10;

function updateRunningSeconds(
  state: GameReducerState,
  deltaMilliseconds: number,
  settings?: GameSettings,
): GameReducerState {
  const updatedStopWatchTime = state.gameStopWatchMs + deltaMilliseconds;
  let timerIsExpired = false;
  let updatedTimerTime = null;

  if (
    settings &&
    settings.gameModifiers.timed.enabled &&
    state.problemTimerMs !== undefined
  ) {
    updatedTimerTime = state.problemTimerMs - deltaMilliseconds;
    if (updatedTimerTime <= 0) {
      timerIsExpired = true;
      updatedTimerTime = settings.gameModifiers.timed.durationSeconds
        ? settings.gameModifiers.timed.durationSeconds * 1000
        : DEFAULT_MAX_SECONDS * 1000;
    }
  }

  const updatedTimeState = {
    ...state,
    gameStopWatchMs: updatedStopWatchTime,
    problemTimerMs: updatedTimerTime,
  } as GameReducerState;

  if (timerIsExpired) {
    // No input when the timer runs out counts as a skip, not a 0 answer.
    return addRoundAttempt(
      updatedTimeState,
      state.inputValue === null ? undefined : Number(state.inputValue),
    );
  }

  return updatedTimeState;
}
