import type { GameMode, GameModifiers } from "@/components/views/GameSettings";
import { type ProblemDefinition } from "@/components/game/Problem";

interface ProblemAttempt {
  attempt: number;
  msElapsed: number;
}

interface Problem extends ProblemDefinition {
  isCompleted: boolean;
  attempts: ProblemAttempt[];
  durationMs: number;
}

export default class GameInstance {
  private playerId: number;
  private state: "running" | "paused" | "errored" | "finished";

  private mode: GameMode;
  private modifiers: GameModifiers;
  private lives: number;

  private startedAt: Date;
  private finishedAt?: Date;
  private msElapsed: number;

  private currentProblem: Problem | undefined;

  private remainingProblems: Problem[];
  private completedProblems: Problem[];

  constructor(
    playerId: number,
    mode: GameMode,
    modifiers: GameModifiers,
    lives: number,
    startedAt: Date,
    currentProblem: ProblemDefinition,
    initialProblems: ProblemDefinition[],
  ) {
    if (!initialProblems.length) throw new Error("No problems provided");

    this.state = "running";
    this.playerId = playerId;
    this.mode = mode;
    this.modifiers = modifiers;
    this.lives = lives;
    this.startedAt = startedAt;

    this.msElapsed = 0;
    this.remainingProblems = initialProblems.map((problem) => ({
      ...problem,
      isCompleted: false,
      attempts: [],
      durationMs: 0,
    }));
    this.completedProblems = [];

    const poppedProblem = this.remainingProblems.shift();
    if (!poppedProblem) {
      throw new Error("No problems provided");
    }
    this.currentProblem = poppedProblem;
  }

  private getRelativeTime(): number {
    return Date.now() - this.startedAt.getTime();
  }

  public addAttempt(answer: number) {
    if (this.currentProblem === undefined) {
      throw new Error("No current problem");
    }

    if (this.currentProblem.isCompleted) {
      throw new Error("Current problem is already completed");
    }

    let msElapsed = this.getRelativeTime() + this.msElapsed;
    if (this.currentProblem.attempts.length > 0) {
      const lastAttempt =
        this.currentProblem.attempts[this.currentProblem.attempts.length - 1]!;
      msElapsed -= lastAttempt.msElapsed;
    }
    this.currentProblem.attempts.push({
      attempt: answer,
      msElapsed: msElapsed,
    });

    if (this.currentProblem.answer === answer) {
      this.completedProblems.push({
        ...this.currentProblem,
        isCompleted: true,
        durationMs: this.currentProblem.attempts.reduce(
          (acc, attempt) => acc + attempt.msElapsed,
          0,
        ),
      });

      if (this.remainingProblems.length === 0) {
        this.state = "finished";
      } else {
        const nextProblem = this.remainingProblems.shift();
        if (!nextProblem) {
          throw new Error("No problems remaining");
        }
        this.currentProblem = nextProblem;
      }
    } else {
      switch (this.mode) {
        case "lives": {
          this.lives--;
          if (this.lives <= 0) {
            this.state = "finished";
          }
          break;
        }

        case "stack": {
          if (this.remainingProblems.length <= 1) {
            return;
          }
          const newProblem = this.remainingProblems.pop();
          if (!newProblem) {
            throw new Error("No problems remaining");
          }

          this.remainingProblems.unshift(this.currentProblem);
          this.currentProblem = newProblem;
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
}
