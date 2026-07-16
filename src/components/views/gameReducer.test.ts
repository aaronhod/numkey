import { describe, expect, it } from "vitest";

import {
  DEFAULT_GAME_SETTINGS,
  type GameSettings,
} from "@/components/views/GameSettings";
import {
  evaluateCandidate,
  gameReducer,
  initialGameState,
  MAX_INPUT_LENGTH,
  type GameReducerState,
} from "@/components/views/gameReducer";
import { type Problem } from "@/game/problem";

const makeProblem = (id: number, answer: number): Problem => ({
  id,
  hash: `h${id}`,
  leftValue: 1,
  rightValue: 1,
  operator: "ADD",
  answer,
});

const makeState = (
  answers: number[],
  settings: GameSettings = DEFAULT_GAME_SETTINGS,
) =>
  initialGameState(
    "player-1",
    answers.map((answer, i) => makeProblem(i, answer)),
    "PRACTICE",
    settings,
  );

const reduce = gameReducer(DEFAULT_GAME_SETTINGS);

const type = (
  state: GameReducerState,
  chars: string,
  reducer = reduce,
): GameReducerState =>
  [...chars].reduce(
    (acc, char) => reducer(acc, { type: "input-insert", value: char }),
    state,
  );

describe("initialGameState", () => {
  it("starts with an empty input and a running game", () => {
    const state = makeState([4]);
    expect(state.inputValue).toBeNull();
    expect(state.negativeMode).toBe(false);
    expect(state.feedback).toBeNull();
    expect(state.gameStopWatchMs).toBe(0);
    expect(state.game.state).toBe("running");
  });
});

describe("input handling", () => {
  it("inserts digits while the input is shorter than the answer", () => {
    const state = type(makeState([123]), "12");
    expect(state.inputValue).toBe("12");
    expect(state.game.currentProblem?.attempts).toHaveLength(0);
    expect(state.feedback).toBeNull();
  });

  it("ignores non-numeric input", () => {
    const state = reduce(makeState([123]), { type: "input-insert", value: "a" });
    expect(state.inputValue).toBeNull();
  });

  it("ignores a second decimal point", () => {
    let state = type(makeState([1.25]), "1.");
    state = reduce(state, { type: "input-insert", value: "." });
    expect(state.inputValue).toBe("1.");
  });

  it("caps the input length", () => {
    // Answer string is longer than the cap, so nothing auto-submits before it.
    const state = type(makeState([2 / 3]), "0.11111111111111");
    expect(state.inputValue?.length).toBeLessThanOrEqual(MAX_INPUT_LENGTH);
  });

  it("removes the last character with input-remove", () => {
    let state = type(makeState([123]), "78");
    state = reduce(state, { type: "input-remove" });
    expect(state.inputValue).toBe("7");
    state = reduce(state, { type: "input-remove" });
    expect(state.inputValue).toBeNull();
  });

  it("toggles and resets negative mode", () => {
    let state = makeState([4]);
    state = reduce(state, { type: "input-toggle-negative", value: "-" });
    expect(state.negativeMode).toBe(true);
    state = reduce(state, { type: "input-toggle-negative", value: "+" });
    expect(state.negativeMode).toBe(false);
  });
});

describe("auto-submit on correct answers", () => {
  it("advances to the next problem and clears the input", () => {
    const state = type(makeState([56, 12]), "56");
    expect(state.game.completedProblems).toHaveLength(1);
    expect(state.game.currentProblem?.answer).toBe(12);
    expect(state.inputValue).toBeNull();
    expect(state.feedback).toEqual({ outcome: "correct", seq: 1 });
  });

  it("finishes the game on the last problem", () => {
    const state = type(makeState([4]), "4");
    expect(state.game.state).toBe("finished");
    expect(state.inputValue).toBe("Done!");
  });

  it("accepts an answer of 0", () => {
    const state = type(makeState([0, 5]), "0");
    expect(state.game.completedProblems).toHaveLength(1);
    expect(state.feedback?.outcome).toBe("correct");
  });

  it("accepts a negative answer entered via negative mode", () => {
    let state = makeState([-10, 5]);
    state = reduce(state, { type: "input-toggle-negative", value: "-" });
    state = type(state, "10");
    expect(state.game.completedProblems).toHaveLength(1);
    expect(state.game.completedProblems[0]?.attempts[0]?.attempt).toBe(-10);
    expect(state.negativeMode).toBe(false);
  });

  it("accepts an exact decimal answer", () => {
    const state = type(makeState([1.5, 5]), "1.5");
    expect(state.game.completedProblems).toHaveLength(1);
  });

  it("accepts a decimal answer without the leading zero", () => {
    const state = type(makeState([0.875, 5]), ".875");
    expect(state.game.completedProblems).toHaveLength(1);
  });

  it("accepts the first MAX_INPUT_LENGTH characters of a non-terminating decimal", () => {
    const answer = 2 / 3; // "0.6666666666666666"
    const typed = Math.abs(answer).toString().slice(0, MAX_INPUT_LENGTH);
    const state = type(makeState([answer, 5]), typed);
    expect(state.game.completedProblems).toHaveLength(1);
  });
});

describe("auto-clear on wrong answers", () => {
  it("clears a wrong single-digit answer immediately (answer 4, typed 1)", () => {
    const state = type(makeState([4, 7]), "1");
    expect(state.inputValue).toBeNull();
    expect(state.feedback).toEqual({ outcome: "wrong", seq: 1 });
    // Normal mode: the same problem stays active, with the attempt recorded.
    expect(state.game.currentProblem?.answer).toBe(4);
    expect(state.game.currentProblem?.attempts).toHaveLength(1);
    expect(state.game.currentProblem?.attempts[0]).toMatchObject({
      attempt: 1,
      type: "EXPLICIT",
    });
  });

  it("clears once the typed length matches the answer (answer 123, typed 888)", () => {
    let state = type(makeState([123, 7]), "88");
    expect(state.inputValue).toBe("88");
    state = type(state, "8");
    expect(state.inputValue).toBeNull();
    expect(state.feedback?.outcome).toBe("wrong");
    expect(state.game.currentProblem?.attempts[0]?.attempt).toBe(888);
  });

  it("treats a sign mismatch as wrong and resets negative mode", () => {
    let state = makeState([4, 7]);
    state = reduce(state, { type: "input-toggle-negative", value: "-" });
    state = type(state, "4");
    expect(state.feedback?.outcome).toBe("wrong");
    expect(state.game.currentProblem?.attempts[0]?.attempt).toBe(-4);
    expect(state.negativeMode).toBe(false);
  });

  it("clears a wrong decimal at the answer's length", () => {
    const state = type(makeState([1.5, 5]), "1.4");
    expect(state.inputValue).toBeNull();
    expect(state.feedback?.outcome).toBe("wrong");
  });

  it("increments the feedback sequence on every attempt", () => {
    let state = type(makeState([4, 7]), "1");
    state = type(state, "2");
    expect(state.feedback).toEqual({ outcome: "wrong", seq: 2 });
  });

  it("moves the problem to the back in stack mode", () => {
    const settings: GameSettings = {
      ...DEFAULT_GAME_SETTINGS,
      gameMode: "stack",
    };
    const reducer = gameReducer(settings);
    const state = type(makeState([4, 7, 9], settings), "1", reducer);
    expect(state.game.currentProblem?.answer).toBe(9);
    expect(state.inputValue).toBeNull();
  });

  it("costs a life in lives mode", () => {
    const settings: GameSettings = {
      ...DEFAULT_GAME_SETTINGS,
      gameMode: "lives",
    };
    const reducer = gameReducer(settings);
    const state = type(makeState([4, 7], settings), "1", reducer);
    expect(state.game.lives).toBe(2);
  });
});

describe("timer expiry", () => {
  const timedSettings: GameSettings = {
    ...DEFAULT_GAME_SETTINGS,
    gameModifiers: {
      ...DEFAULT_GAME_SETTINGS.gameModifiers,
      timed: { enabled: true, durationSeconds: 1 },
    },
  };

  it("records a skip when the timer runs out with no input", () => {
    const reducer = gameReducer(timedSettings);
    const state = reducer(makeState([4, 7], timedSettings), {
      type: "update-timer",
      value: 1000,
    });
    expect(state.game.currentProblem?.attempts[0]).toMatchObject({
      attempt: null,
      type: "SKIPPED",
    });
    expect(state.feedback?.outcome).toBe("wrong");
    expect(state.problemTimerMs).toBe(1000);
  });
});

describe("evaluateCandidate", () => {
  it.each([
    [4, "4", false, "correct"],
    [4, "1", false, "wrong"],
    [56, "5", false, "incomplete"],
    [56, "55", false, "wrong"],
    [123, "88", false, "incomplete"],
    [123, "888", false, "wrong"],
    [-10, "10", true, "correct"],
    [-10, "10", false, "wrong"],
    [0, "0", false, "correct"],
    [1.5, "1.", false, "incomplete"],
    [1.5, "1.5", false, "correct"],
    [1.5, "1.4", false, "wrong"],
    [0.875, ".875", false, "correct"],
  ] as const)(
    "answer %d, typed %s (negative %s) → %s",
    (answer, candidate, negativeMode, expected) => {
      expect(evaluateCandidate(answer, candidate, negativeMode)).toBe(expected);
    },
  );

  it("treats a lone dot as incomplete", () => {
    expect(evaluateCandidate(4, ".", false)).toBe("incomplete");
  });
});
