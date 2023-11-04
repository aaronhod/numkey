import type { Problem } from "@/components/game/Problem";
import type { ProblemAttempts } from "@/components/game/Game";
import type { FinishedRound } from "@/server/api/routers/games";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface State {
  inputValue: string | null;
  prevInputValue: string;
  problemQueue: Problem[];
  currentProblem: Problem | null;
  currentProblemAttempts: ProblemAttempts;
  finishedProblems: FinishedRound[];
  lastSubmittedAt: Dayjs;
  allCompleted: boolean;
}

type Action =
  | { type: "input-insert"; value: string }
  | { type: "input-remove" }
  | { type: "add-attempt"; value: number };
export const initialGameState = (problemSet: Problem[]): State => ({
  inputValue: null,
  prevInputValue: "",
  problemQueue: problemSet.slice(1),
  currentProblem: problemSet[0] ?? null,
  currentProblemAttempts: new Map(),
  finishedProblems: [],
  lastSubmittedAt: dayjs(),
  allCompleted: false,
});

export const gameReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "input-insert":
      return insertCharacter(action.value, state);
    case "input-remove":
      return removeCharacter(state);
    case "add-attempt":
      return addRoundAttempt(action.value, state);
    default:
      return state;
  }
};

function insertCharacter(newValue: string, state: State): State {
  const asNumber = Number(newValue);
  const validValue =
    (Number.isFinite(asNumber) && asNumber >= 0 && asNumber <= 9) ||
    newValue === ".";

  if (validValue) {
    return {
      ...state,
      inputValue: [state.inputValue, newValue].join(""),
      prevInputValue: state.inputValue ?? "",
    };
  }

  return state;
}

function removeCharacter(state: State): State {
  return {
    ...state,
    inputValue: state.inputValue?.slice(0, -1) ?? null,
    prevInputValue: state.inputValue ?? "",
  };
}

function addRoundAttempt(answer: number, state: State): State {
  const finishedAt = dayjs();
  const timeDiff = finishedAt.diff(state.lastSubmittedAt, "millisecond");
  const updatedAttempts = new Map(state.currentProblemAttempts).set(
    state.currentProblemAttempts.size,
    {
      value: answer,
      secondsElapsed: timeDiff,
    },
  );

  if (answer !== state.currentProblem?.answer) {
    return {
      ...state,
      currentProblemAttempts: updatedAttempts,
      lastSubmittedAt: finishedAt,
      inputValue: null,
      prevInputValue: "",
    };
  }

  const totalDuration = Array.from(updatedAttempts.values()).reduce(
    (acc, problem) => acc + problem.secondsElapsed,
    0,
  );

  const mappedAttempts = Array.from(
    updatedAttempts.entries(),
    ([ordering, { value }]) => ({
      ordering,
      value,
    }),
  );

  // no remaining problems to solve, so all are completed
  const allCompleted = state.problemQueue.length === 0;

  return {
    ...state,
    currentProblem: state.problemQueue[0] ?? null,
    problemQueue: state.problemQueue.slice(1),
    currentProblemAttempts: new Map(),
    lastSubmittedAt: finishedAt,
    inputValue: null,
    prevInputValue: "",
    allCompleted: allCompleted,
    finishedProblems: [
      ...state.finishedProblems,
      {
        ...state.currentProblem,
        isCompleted: true,
        duration: totalDuration,
        attempts: mappedAttempts,
      },
    ],
  };
}
