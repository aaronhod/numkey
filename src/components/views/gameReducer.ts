import type { Problem } from "@/game/problem";
import type { GameSettings } from "@/components/views/Game";
import newGameInstance, {
  addAttempt,
  type GameInstance,
} from "@/game/gameInstance";

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
    }
  | {
      type: "pause-game";
      value?: boolean;
    };

type ToggleChar = "+" | "-";

export interface GameReducerState {
  game: GameInstance;
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
  playerId: string | null,
  problemSet: Problem[],
  settings: GameSettings,
): GameReducerState => {
  const gameInstance = newGameInstance(
    playerId,
    settings.gameMode,
    settings.gameModifiers,
    3,
    new Date(),
    problemSet,
  );

  return {
    game: gameInstance,
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
  (settings?: GameSettings) =>
  (state: GameReducerState, action: Action): GameReducerState => {
    switch (action.type) {
      case "input-insert":
        return insertCharacter(state, action.value);
      case "input-remove":
        return removeCharacter(state);
      case "input-toggle-negative":
        return toggleNegativeInput(state, action.value);
      case "add-attempt":
        return addRoundAttempt(state, action.value);
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

function insertCharacter(
  state: GameReducerState,
  newValue: string,
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
  if (ans && state.negativeMode) {
    ans = -ans;
  }

  let newInputValue = state.inputValue;
  let prevInputValue = state.prevInputValue;
  if (ans && state.game.currentProblem.answer === ans) {
    if (state.game.state === "finished") {
      newInputValue = "Done!";
    } else {
      newInputValue = null;
    }
    prevInputValue = "";
  }

  return {
    ...state,
    game: addAttempt(structuredClone(state.game), ans),
    inputValue: newInputValue,
    prevInputValue: prevInputValue,
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
    return addRoundAttempt(updatedTimeState, Number(state.inputValue));
  }

  return updatedTimeState;
}
