import { type Problem, type ProblemDefinition } from "@/game/problem";
import { type FinishedGame } from "@/server/api/routers/games";
import dayjs from "dayjs";
import {
  DEFAULT_GAME_SETTINGS,
  type GameCategory,
  type GameSettings,
} from "Macaca/packages/ui/src/components/views/GameSettings";

interface ProblemAttempt {
  attempt: number | null;
  type: "IMPLICIT" | "EXPLICIT" | "SKIPPED";
  msElapsed: number;
}

interface ActiveProblem extends Problem {
  isCompleted: boolean;
  attempts: ProblemAttempt[];
  durationMs: number;
}

type GameState = "running" | "paused" | "errored" | "finished";

interface GameInstance {
  playerId: string;
  state: GameState;
  category: GameCategory;
  settings: GameSettings;
  lives: number;
  startedAt: Date;
  finishedAt?: Date;
  msElapsed: number;
  pause: {
    isPaused: boolean;
    startedAt?: Date;
    endedAt?: Date;
  };
  currentProblem?: ActiveProblem;
  remainingProblems: ActiveProblem[];
  completedProblems: ActiveProblem[];
}

const newGameInstance = (
  playerId: string,
  category: GameCategory,
  settings: GameSettings = DEFAULT_GAME_SETTINGS,
  lives: number,
  startedAt: Date,
  initialProblems: Problem[],
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
    category,
    settings,
    lives,
    startedAt,
    finishedAt: undefined,
    msElapsed: 0,
    pause: {
      isPaused: false,
    },
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

  const currentProblemAttemptsDuration = game.currentProblem.attempts.reduce(
    (acc, attempt) => acc + attempt.msElapsed,
    0,
  );
  const allFinishedProblemsDuration = game.completedProblems.reduce(
    (acc, problem) => acc + problem.durationMs,
    0,
  );
  const pausedDuration = dayjs(game.pause.endedAt).diff(
    game.pause.startedAt,
    "millisecond",
  );

  const currentAttemptDuration =
    dayjs().diff(game.startedAt, "millisecond") -
    (currentProblemAttemptsDuration + allFinishedProblemsDuration) -
    pausedDuration;

  if (game.pause.endedAt) {
    game.msElapsed += dayjs().diff(game.pause.endedAt, "millisecond");
    game.pause.endedAt = undefined;
  }

  game.currentProblem.attempts.push({
    attempt: answer ?? null,
    msElapsed: currentAttemptDuration,
    type: answer ? "EXPLICIT" : "SKIPPED",
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
    game.pause = {
      isPaused: false,
      startedAt: undefined,
      endedAt: undefined,
    };

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
    switch (game.settings.gameMode) {
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

const getFinishedGame = (game: GameInstance): FinishedGame => {
  return {
    userId: game.playerId,
    category: game.category,
    settings: game.settings,
    startedAt: game.startedAt,
    finishedAt: new Date(),
    rounds: game.completedProblems.map((problem) => ({
      problemId: problem.id,
      isCompleted: problem.isCompleted,
      durationMs: problem.durationMs,
      attempts: problem.attempts.map((attempt, index) => ({
        ordering: index,
        value: attempt.attempt ?? 0,
        type: attempt.type,
      })),
    })),
  } satisfies FinishedGame;
};

const isAnswerCorrect = (
  problem: ProblemDefinition,
  answer: number,
): boolean => {
  return problem.answer === answer;
};

export type { GameInstance, ActiveProblem, ProblemAttempt };
export {
  newGameInstance as default,
  addAttempt,
  getFinishedGame,
  isAnswerCorrect,
};
