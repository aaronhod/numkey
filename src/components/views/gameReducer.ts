import type { ProblemDefinition } from "@/components/game/problem";
import type { GameSettings } from "@/components/views/Game";
import GameInstance from "@/components/game/gameInstance";

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

export interface GameReducerState {
  gameInstance: GameInstance;
  inputValue: string | null;
  prevInputValue: string;
  negativeMode: boolean;
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
  problemSet: ProblemDefinition[],
  settings: GameSettings,
): GameReducerState => {
  const gameInstance = new GameInstance(
    playerId,
    settings.gameMode,
    settings.gameModifiers,
    3,
    new Date(),
    problemSet,
  );

  return {
    gameInstance: gameInstance,
    inputValue: null,
    prevInputValue: "",
    negativeMode: false,
    gameStopWatchMs: 0,
    problemTimerMs: settings.gameModifiers.timed.enabled
      ? settings.gameModifiers.timed.durationSeconds * 1000
      : undefined,
  };
};

export const gameReducer =
  (settings: GameSettings) =>
  (state: GameReducerState, action: Action): GameReducerState => {
    switch (action.type) {
      case "input-insert":
        return insertCharacter(action.value, state);
      case "input-remove":
        return removeCharacter(state);
      case "input-toggle-negative":
        return toggleNegativeInput(action.value, state);
      case "add-attempt":
        return addRoundAttempt(action.value, state);
      case "update-timer":
        return updateRunningSeconds(action.value, state, settings);
      default:
        return state;
    }
  };

function insertCharacter(
  newValue: string,
  state: GameReducerState,
): GameReducerState {
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

function removeCharacter(state: GameReducerState): GameReducerState {
  return {
    ...state,
    inputValue: state.inputValue?.slice(0, -1) ?? null,
    prevInputValue: state.prevInputValue?.slice(0, -1) ?? "",
  };
}

// - is a toggle, + is a reset
function toggleNegativeInput(
  toggleChar: ToggleChar,
  state: GameReducerState,
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
  answer: number | undefined,
  state: GameReducerState,
): GameReducerState {
  if (!state.gameInstance.currentProblem) {
    return state;
  }

  let ans = answer;
  if (ans && state.negativeMode) {
    ans = -ans;
  }

  state.gameInstance.addAttempt(ans);
  return {
    ...state,
    gameInstance: state.gameInstance,
  };
}

const DEFAULT_MAX_SECONDS = 10;

function updateRunningSeconds(
  deltaMilliseconds: number,
  state: GameReducerState,
  settings: GameSettings,
): GameReducerState {
  const updatedStopWatchTime = state.gameStopWatchMs + deltaMilliseconds;
  let timerIsExpired = false;
  let updatedTimerTime = null;

  if (
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
    return addRoundAttempt(Number(state.inputValue), updatedTimeState);
  }

  return updatedTimeState;
}
