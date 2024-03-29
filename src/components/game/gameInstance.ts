import type { GameMode, GameModifiers } from "@/components/views/GameSettings";
import { type ProblemDefinition } from "@/components/game/problem";
import { type FinishedGame } from "@/server/api/routers/games";

interface ProblemAttempt {
  attempt: number | null;
  msElapsed: number;
}

interface Problem extends ProblemDefinition {
  isCompleted: boolean;
  attempts: ProblemAttempt[];
  durationMs: number;
}

type GameState = "running" | "paused" | "errored" | "finished";

interface GameInstance {
  playerId: string;
  state: GameState;
  mode: GameMode;
  modifiers: GameModifiers;
  lives: number;
  startedAt: Date;
  finishedAt?: Date;
  msElapsed: number;
  currentProblem?: Problem;
  remainingProblems: Problem[];
  completedProblems: Problem[];
}

const newGameInstance = (
  playerId: string,
  mode: GameMode,
  modifiers: GameModifiers,
  lives: number,
  startedAt: Date,
  initialProblems: ProblemDefinition[],
): GameInstance => {
  if (!initialProblems.length) {
    throw new Error("No problems provided");
  }

  const remainingProblems = initialProblems.map((problem) => ({
    ...problem,
    isCompleted: false,
    attempts: [],
    durationMs: 0,
  }));
  const currentProblem = remainingProblems.shift();
  if (!currentProblem) {
    throw new Error("No problems provided");
  }

  return {
    playerId,
    state: "running",
    mode,
    modifiers,
    lives,
    startedAt,
    finishedAt: undefined,
    msElapsed: 0,
    currentProblem: currentProblem,
    remainingProblems: remainingProblems,
    completedProblems: [],
  };
};

const addAttempt = (
  game: GameInstance,
  answer: number | undefined,
): GameInstance => {
  if (game.currentProblem === undefined) {
    throw new Error("No current problem");
  }

  if (game.currentProblem.isCompleted) {
    throw new Error("Current problem is already completed");
  }

  let msElapsed = getRelativeTime(game.startedAt) + game.msElapsed;
  if (game.currentProblem.attempts.length > 0) {
    const lastAttempt =
      game.currentProblem.attempts[game.currentProblem.attempts.length - 1]!;
    msElapsed -= lastAttempt.msElapsed;
  }
  game.currentProblem.attempts.push({
    attempt: answer ?? null,
    msElapsed: msElapsed,
  });

  // correct answer
  if (game.currentProblem.answer === answer) {
    game.completedProblems.push({
      ...game.currentProblem,
      isCompleted: true,
      durationMs: game.currentProblem.attempts.reduce(
        (acc, attempt) => acc + attempt.msElapsed,
        0,
      ),
    });

    // finish game or move to next problem
    if (game.remainingProblems.length === 0) {
      game.state = "finished";
    } else {
      const nextProblem = game.remainingProblems.shift();
      if (!nextProblem) {
        throw new Error("No problems remaining");
      }
      game.currentProblem = nextProblem;
    }
  } else {
    switch (game.mode) {
      case "lives": {
        game.lives--;
        if (game.lives <= 0) {
          game.state = "finished";
        }
        break;
      }

      case "stack": {
        if (game.remainingProblems.length <= 1) {
          break;
        }
        const newProblem = game.remainingProblems.pop();
        if (!newProblem) {
          throw new Error("No problems remaining");
        }

        game.remainingProblems.unshift(game.currentProblem);
        game.currentProblem = newProblem;
        break;
      }
      case "endless":
      case "normal":
      default: {
        break;
      }
    }
  }
  return game;
};

const getRelativeTime = (time: Date): number => {
  return Date.now() - time.getTime();
};

const getFinishedGame = (game: GameInstance): FinishedGame => {
  return {
    userId: game.playerId,
    startedAt: game.startedAt,
    finishedAt: new Date(),
    rounds: game.completedProblems.map((problem) => ({
      leftValue: problem.leftValue,
      rightValue: problem.rightValue,
      operator: problem.operator,
      answer: problem.answer,
      isCompleted: problem.isCompleted,
      durationMs: problem.durationMs,
      attempts: problem.attempts.map((attempt, index) => ({
        ordering: index,
        value: attempt.attempt ?? 0,
      })),
    })),
  } as FinishedGame;
};

const isAnswerCorrect = (
  problem: ProblemDefinition,
  answer: number,
): boolean => {
  return problem.answer === answer;
};

export type { GameInstance, Problem, ProblemAttempt };
export {
  newGameInstance as default,
  addAttempt,
  getFinishedGame,
  isAnswerCorrect,
};
