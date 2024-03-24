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

export default class GameInstance {
  readonly #playerId: string;
  #state: "running" | "paused" | "errored" | "finished";

  readonly #mode: GameMode;
  readonly #modifiers: GameModifiers;
  #lives: number;

  readonly #startedAt: Date;
  #finishedAt?: Date;
  #msElapsed: number;

  #currentProblem: Problem | undefined;

  #remainingProblems: Problem[];
  #completedProblems: Problem[];

  constructor(
    playerId: string,
    mode: GameMode,
    modifiers: GameModifiers,
    lives: number,
    startedAt: Date,
    initialProblems: ProblemDefinition[],
  ) {
    if (!initialProblems.length) throw new Error("No problems provided");

    this.#playerId = playerId;
    this.#state = "running";
    this.#mode = mode;
    this.#modifiers = modifiers;
    this.#lives = lives;
    this.#startedAt = startedAt;
    this.#finishedAt = undefined;

    this.#msElapsed = 0;
    this.#remainingProblems = initialProblems.map((problem) => ({
      ...problem,
      isCompleted: false,
      attempts: [],
      durationMs: 0,
    }));
    this.#completedProblems = [];

    const poppedProblem = this.#remainingProblems.shift();
    if (!poppedProblem) {
      throw new Error("No problems provided");
    }
    this.#currentProblem = poppedProblem;
  }

  private getRelativeTime(): number {
    return Date.now() - this.#startedAt.getTime();
  }

  public toFinishedGame(): FinishedGame {
    return {
      userId: this.#playerId,
      startedAt: this.#startedAt,
      finishedAt: new Date(),
      rounds: this.#completedProblems.map((problem) => ({
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
  }

  public addAttempt(answer: number | undefined): void {
    if (this.#currentProblem === undefined) {
      throw new Error("No current problem");
    }

    if (this.#currentProblem.isCompleted) {
      throw new Error("Current problem is already completed");
    }

    let msElapsed = this.getRelativeTime() + this.#msElapsed;
    if (this.#currentProblem.attempts.length > 0) {
      const lastAttempt =
        this.#currentProblem.attempts[
          this.#currentProblem.attempts.length - 1
        ]!;
      msElapsed -= lastAttempt.msElapsed;
    }
    this.#currentProblem.attempts.push({
      attempt: answer ?? null,
      msElapsed: msElapsed,
    });

    if (this.#currentProblem.answer === answer) {
      this.#completedProblems.push({
        ...this.#currentProblem,
        isCompleted: true,
        durationMs: this.#currentProblem.attempts.reduce(
          (acc, attempt) => acc + attempt.msElapsed,
          0,
        ),
      });

      if (this.#remainingProblems.length === 0) {
        this.#state = "finished";
      } else {
        const nextProblem = this.#remainingProblems.shift();
        if (!nextProblem) {
          throw new Error("No problems remaining");
        }
        this.#currentProblem = nextProblem;
      }
    } else {
      switch (this.#mode) {
        case "lives": {
          this.#lives--;
          if (this.#lives <= 0) {
            this.#state = "finished";
          }
          break;
        }

        case "stack": {
          if (this.#remainingProblems.length <= 1) {
            return;
          }
          const newProblem = this.#remainingProblems.pop();
          if (!newProblem) {
            throw new Error("No problems remaining");
          }

          this.#remainingProblems.unshift(this.#currentProblem);
          this.#currentProblem = newProblem;
          break;
        }
        case "endless":
        case "normal":
        default: {
          break;
        }
      }
    }
  }

  get playerId(): string {
    return this.#playerId;
  }

  get state(): "running" | "paused" | "errored" | "finished" {
    return this.#state;
  }

  get mode(): GameMode {
    return this.#mode;
  }

  get modifiers(): GameModifiers {
    return this.#modifiers;
  }

  get lives(): number {
    return this.#lives;
  }

  get startedAt(): Date {
    return this.#startedAt;
  }

  get finishedAt(): Date | undefined {
    return this.#finishedAt;
  }

  get msElapsed(): number {
    return this.#msElapsed;
  }

  set msElapsed(value: number) {
    this.#msElapsed = value;
  }

  get currentProblem(): Problem | undefined {
    return this.#currentProblem;
  }

  get remainingProblems(): Problem[] {
    return this.#remainingProblems;
  }

  get completedProblems(): Problem[] {
    return this.#completedProblems;
  }
}
