import type { GameInstance } from "@/game/gameInstance";
import type { GameSettings } from "@/components/views/GameSettings";
import type { ResultRound } from "@/components/views/GameResults";

/**
 * Guest-mode persistence: finished games live in localStorage instead of the
 * database. Only QuickPlay is available to guests.
 */
export interface GuestGame {
  id: string;
  settings?: GameSettings;
  startedAt: string;
  finishedAt: string;
  rounds: ResultRound[];
}

const STORAGE_KEY = "guestGames";
// QuickPlay games run to a few hundred rounds each, so keep the history
// small enough to stay well inside the localStorage quota.
const MAX_STORED_GAMES = 20;

export function getGuestGames(): GuestGame[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as GuestGame[]) : [];
  } catch {
    return [];
  }
}

export function getGuestGame(id: string): GuestGame | null {
  return getGuestGames().find((game) => game.id === id) ?? null;
}

export function saveGuestGame(game: GameInstance): GuestGame {
  const record: GuestGame = {
    id: Date.now().toString(36),
    settings: game.settings,
    startedAt: new Date(game.startedAt).toISOString(),
    finishedAt: new Date().toISOString(),
    rounds: game.completedProblems.map((problem) => ({
      problem: {
        leftValue: problem.leftValue,
        rightValue: problem.rightValue,
        operator: problem.operator,
        answer: problem.answer,
      },
      isCompleted: problem.isCompleted,
      // Durations are float ms deltas; whole milliseconds are plenty.
      durationMs: Math.round(problem.durationMs),
      attemptCount: problem.attempts.length,
    })),
  };

  const games = [record, ...getGuestGames()].slice(0, MAX_STORED_GAMES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch {
    // Storage full or unavailable — the results page still gets the record
    // via the in-memory return value.
  }
  return record;
}
