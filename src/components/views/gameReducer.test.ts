import { describe, expect, it } from "vitest";

import { DEFAULT_GAME_SETTINGS } from "@/components/views/GameSettings";
import { gameReducer, initialGameState } from "@/components/views/gameReducer";
import { generateProblems, type Problem } from "@/game/problem";

const problems: Problem[] = generateProblems([2], ["ADD"]).map((p, i) => ({
  ...p,
  id: i,
  hash: `h${i}`,
}));

const makeState = () =>
  initialGameState("player-1", problems, "PRACTICE", DEFAULT_GAME_SETTINGS);
const reduce = gameReducer(DEFAULT_GAME_SETTINGS);

describe("initialGameState", () => {
  it("starts with an empty input and a running game", () => {
    const state = makeState();
    expect(state.inputValue).toBeNull();
    expect(state.prevInputValue).toBe("");
    expect(state.negativeMode).toBe(false);
    expect(state.gameStopWatchMs).toBe(0);
    expect(state.game).toBeDefined();
  });
});

describe("gameReducer input handling", () => {
  it("inserts digit characters", () => {
    let state = makeState();
    state = reduce(state, { type: "input-insert", value: "5" });
    expect(state.inputValue).toBe("5");
    state = reduce(state, { type: "input-insert", value: "3" });
    expect(state.inputValue).toBe("53");
  });

  it("ignores non-numeric input", () => {
    const state = reduce(makeState(), { type: "input-insert", value: "a" });
    expect(state.inputValue).toBeNull();
  });

  it("removes the last character", () => {
    let state = makeState();
    state = reduce(state, { type: "input-insert", value: "7" });
    state = reduce(state, { type: "input-insert", value: "8" });
    state = reduce(state, { type: "input-remove" });
    expect(state.inputValue).toBe("7");
  });

  it("toggles and resets negative mode", () => {
    let state = makeState();
    state = reduce(state, { type: "input-toggle-negative", value: "-" });
    expect(state.negativeMode).toBe(true);
    state = reduce(state, { type: "input-toggle-negative", value: "+" });
    expect(state.negativeMode).toBe(false);
  });

  it("clears the input when the current problem is answered correctly", () => {
    let state = makeState();
    const answer = state.game.currentProblem?.answer;
    expect(answer).toBeTypeOf("number");
    state = reduce(state, { type: "input-insert", value: "9" });
    state = reduce(state, { type: "add-attempt", value: answer });
    expect(state.inputValue).toBeNull();
  });
});
